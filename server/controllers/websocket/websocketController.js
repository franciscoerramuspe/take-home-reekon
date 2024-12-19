import jwt from 'jsonwebtoken';
import supabase from '../../db/supabase.js';

export const websocketController = {
  batteryTimers: new Map(),
  drainInterval: 60000, // 1 minute
  drainRate: 5, // Integer drain rate

  async startBatteryDrain(robotId, organizationId, io) {
    console.log(`[Battery] Starting drain for robot ${robotId}`);
    
    // First check if we already have a timer running
    if (this.batteryTimers.has(robotId)) {
      console.log(`[Battery] Timer already exists for robot ${robotId}`);
      return; // Exit if timer already exists
    }

    const timer = setInterval(async () => {
      try {
        // Get current battery level
        const { data: robot, error } = await supabase
          .from('robots')
          .select('battery_level, status')
          .eq('id', robotId)
          .single();

        if (error || !robot) {
          console.error('[Battery] Error fetching robot:', error);
          this.stopBatteryDrain(robotId);
          return;
        }

        if (robot.status !== 'online') {
          console.log(`[Battery] Robot ${robotId} no longer online, stopping drain`);
          this.stopBatteryDrain(robotId);
          return;
        }

        const newBatteryLevel = Math.max(0, Math.floor(robot.battery_level - this.drainRate));
        console.log(`[Battery] New level for robot ${robotId}: ${newBatteryLevel}`);

        // Update battery level
        const { error: updateError } = await supabase
          .from('robots')
          .update({ 
            battery_level: newBatteryLevel,
            status: newBatteryLevel === 0 ? 'offline' : robot.status,
            last_active: new Date().toISOString()
          })
          .eq('id', robotId);

        if (updateError) {
          console.error('[Battery] Error updating battery:', updateError);
          return;
        }

        this.emitBatteryUpdate(io, organizationId, robotId, newBatteryLevel);
        
        if (newBatteryLevel === 0) {
          console.log(`[Battery] Robot ${robotId} battery depleted, setting to offline`);
          this.emitStatusUpdate(io, organizationId, robotId, 'offline');
          this.stopBatteryDrain(robotId);
        }
      } catch (error) {
        console.error('[Battery] Drain error:', error);
      }
    }, this.drainInterval);

    this.batteryTimers.set(robotId, timer);
    console.log(`[Battery] Drain timer set for robot ${robotId}`);
  },

  stopBatteryDrain(robotId) {
    console.log(`[Battery] Stopping drain for robot ${robotId}`);
    const timer = this.batteryTimers.get(robotId);
    if (timer) {
      clearInterval(timer);
      this.batteryTimers.delete(robotId);
    }
  },

  handleConnection(socket) {
    console.log('New socket connection attempt:', socket.id);

    socket.on('authenticate', async (token) => {
      console.log('Authentication attempt from socket:', socket.id);
      
      try {
        if (!token) {
          console.log('No token provided for socket:', socket.id);
          throw new Error('No token provided');
        }

        console.log('Verifying token for socket:', socket.id);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified for socket:', socket.id, 'decoded:', decoded);

        if (!decoded.organizationId) {
          console.log('No organization ID in token for socket:', socket.id);
          throw new Error('Invalid organization');
        }

        const roomName = `org:${decoded.organizationId}`;
        console.log(`Adding socket ${socket.id} to room:`, roomName);
        
        socket.join(roomName);
        socket.emit('authenticated', { 
          success: true,
          organizationId: decoded.organizationId 
        });

        // Add robot-specific event handlers
        socket.on('robot:status_update', (data) => {
          const { robotId, status, batteryLevel } = data;
          io.to(roomName).emit('robot:status_update', {
            robotId,
            status,
            batteryLevel,
            timestamp: new Date().toISOString()
          });
        });

        socket.on('robot:location_update', (data) => {
          const { robotId, latitude, longitude } = data;
          io.to(roomName).emit('robot:location_update', {
            robotId,
            latitude,
            longitude,
            timestamp: new Date().toISOString()
          });
        });
        
        console.log(`Socket ${socket.id} successfully authenticated and joined ${roomName}`);
      } catch (error) {
        console.error('Socket authentication error:', {
          socketId: socket.id,
          error: error.message,
          stack: error.stack
        });
        
        socket.emit('authenticated', { 
          success: false, 
          error: error.message 
        });
        
        socket.disconnect();
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', {
        socketId: socket.id,
        reason: reason
      });
    });
  },

  emitBatteryUpdate(io, organizationId, robotId, batteryLevel) {
    io.to(`org:${organizationId}`).emit('robot:battery_update', {
      robotId,
      batteryLevel,
      timestamp: new Date().toISOString()
    });
  },

  emitStatusUpdate(io, organizationId, robotId, status) {
    io.to(`org:${organizationId}`).emit('robot:status_update', {
      robotId,
      status,
      timestamp: new Date().toISOString()
    });
  },

  emitLocationUpdate(io, organizationId, robotId, latitude, longitude) {
    io.to(`org:${organizationId}`).emit('robot:location_update', {
      robotId,
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    });
  }
}; 
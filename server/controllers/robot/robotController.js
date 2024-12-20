import supabase from '../../db/supabase.js';

export const robotController = {
  async createRobot(req, res) {
    try {
      const { name } = req.body;
      const { organizationId } = req.user;

      const { data: robot, error } = await supabase
        .from('robots')
        .insert([
          {
            name,
            organization_id: organizationId,
            status: 'offline',
            battery_level: 100,
            last_active: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(robot);
    } catch (error) {
      console.error('Error creating robot:', error);
      res.status(500).json({ error: 'Failed to create robot' });
    }
  },

  async getRobots(req, res) {
    try {
      const { organizationId } = req.user;

      const { data: robots, error } = await supabase
        .from('robots')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(robots);
    } catch (error) {
      console.error('Error fetching robots:', error);
      res.status(500).json({ error: 'Failed to fetch robots' });
    }
  },

  async updateRobotStatus(req, res) {
    try {
      const { robotId } = req.params;
      const { status, batteryLevel } = req.body;
      const { organizationId } = req.user;

      console.log('Starting update for:', { robotId, status, batteryLevel });

      // First verify the robot exists
      const { data: robot, error: fetchError } = await supabase
        .from('robots')
        .select('*')
        .eq('id', robotId)
        .eq('organization_id', organizationId)
        .single();

      if (fetchError || !robot) {
        console.error('Robot not found:', fetchError);
        return res.status(404).json({ error: 'Robot not found' });
      }

      // Do the update without select
      const { error: updateError } = await supabase
        .from('robots')
        .update({
          status: status,
          battery_level: batteryLevel,
          updated_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        })
        .eq('id', robotId)
        .eq('organization_id', organizationId);

      if (updateError) {
        console.error('Update error:', updateError);
        return res.status(400).json({ error: 'Failed to update robot status' });
      }

      // Fetch the updated robot separately
      const { data: updatedRobot, error: fetchUpdatedError } = await supabase
        .from('robots')
        .select('*')
        .eq('id', robotId)
        .eq('organization_id', organizationId)
        .single();

      if (fetchUpdatedError) {
        console.error('Error fetching updated robot:', fetchUpdatedError);
        return res.status(400).json({ error: 'Failed to fetch updated robot' });
      }

      console.log('Successfully updated robot:', updatedRobot);
      res.json(updatedRobot);
    } catch (error) {
      console.error('Error in updateRobotStatus:', error);
      res.status(500).json({ error: 'Failed to update robot status' });
    }
  },

  async assignTask(req, res) {
    try {
      const { robotId } = req.params;
      const { taskType, parameters, priority = 'normal' } = req.body;
      const { organizationId } = req.user;

      // Verify robot is available
      const { data: robot, error: robotError } = await supabase
        .from('robots')
        .select('*')
        .eq('id', robotId)
        .eq('organization_id', organizationId)
        .single();

      if (robotError || !robot) {
        return res.status(404).json({ error: 'Robot not found' });
      }

      if (robot.status !== 'online') {
        return res.status(400).json({ error: 'Robot is not available' });
      }

      // Create task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert([
          {
            robot_id: robotId,
            organization_id: organizationId,
            task_type: taskType,
            parameters,
            priority,
            status: 'pending',
            created_by: req.user.id
          }
        ])
        .select()
        .single();

      if (taskError) throw taskError;

      res.status(201).json(task);
    } catch (error) {
      console.error('Error assigning task:', error);
      res.status(500).json({ error: 'Failed to assign task' });
    }
  },

  async getRobotAnalytics(req, res) {
    try {
      const { robotId } = req.params;
      const { timeframe = '24h' } = req.query;
      const { organizationId } = req.user;

      const timeAgo = new Date(Date.now() - getTimeframeMs(timeframe)).toISOString();

      // Get task stats using rpc
      const { data: tasks, error: taskError } = await supabase.rpc('get_robot_task_stats', {
        p_robot_id: robotId,
        p_organization_id: organizationId,
        p_time_ago: timeAgo
      });

      if (taskError) throw taskError;

      // Get battery history - simplified query
      const { data: batteryHistory, error: batteryError } = await supabase
        .from('robot_metrics')
        .select('battery_level, timestamp')
        .eq('robot_id', robotId)
        .gte('timestamp', timeAgo)
        .order('timestamp', { ascending: false });

      if (batteryError) throw batteryError;

      // Get current robot status
      const { data: robot, error: robotError } = await supabase
        .from('robots')
        .select('status, battery_level, last_active')
        .eq('id', robotId)
        .eq('organization_id', organizationId)
        .single();

      if (robotError) throw robotError;

      // Calculate analytics
      const analytics = {
        currentStatus: {
          status: robot.status,
          batteryLevel: robot.battery_level,
          lastActive: robot.last_active
        },
        taskStats: tasks || [],
        batteryTrend: calculateBatteryTrend(batteryHistory || []),
        timeframe
      };

      res.json(analytics);
    } catch (error) {
      console.error('Error fetching robot analytics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch robot analytics',
        details: error.message 
      });
    }
  },

  // Helper function to convert timeframe to milliseconds
  getTimeframeMs(timeframe) {
    const units = {
      h: 3600000,
      d: 86400000,
      w: 604800000
    };
    const value = parseInt(timeframe);
    const unit = timeframe.slice(-1);
    return value * (units[unit] || units.h);
  },

  async deleteRobot(req, res) {
    try {
      const { robotId } = req.params;
      const { organizationId } = req.user;

      console.log('Delete Request:', {
        robotId,
        organizationId
      });

      // First, verify the robot exists and belongs to the organization
      const { data: robot, error: fetchError } = await supabase
        .from('robots')
        .select('*')
        .eq('id', robotId)
        .eq('organization_id', organizationId)
        .single();

      console.log('Fetch Result:', { robot, fetchError });

      if (fetchError || !robot) {
        return res.status(404).json({ 
          error: 'Robot not found or does not belong to your organization'
        });
      }

      // Try using RPC to delete
      const { data, error: deleteError } = await supabase.rpc('delete_robot', {
        robot_id: robotId,
        org_id: organizationId
      });

      console.log('Delete RPC Result:', { data, deleteError });

      if (deleteError) {
        throw deleteError;
      }

      res.json({ 
        message: 'Robot deleted successfully',
        deletedRobotId: robotId
      });
    } catch (error) {
      console.error('Error deleting robot:', error);
      res.status(500).json({ 
        error: 'Failed to delete robot',
        details: error.message 
      });
    }
  },

  async updateRobotLocation(req, res) {
    try {
      const { robotId } = req.params;
      const { latitude, longitude } = req.body;

      const { data, error } = await supabase
        .from('robot_locations')
        .insert([
          {
            robot_id: robotId,
            latitude,
            longitude
          }
        ])
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating robot location:', error);
      res.status(500).json({ error: 'Failed to update robot location' });
    }
  },

  async getRobotLocation(req, res) {
    try {
      const { robotId } = req.params;
      const { organizationId } = req.user;

      const { data, error } = await supabase
        .from('robot_latest_locations')
        .select('*')
        .eq('robot_id', robotId)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Location not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching robot location:', error);
      res.status(500).json({ error: 'Failed to fetch robot location' });
    }
  },

  async getAllRobotLocations(req, res) {
    try {
      const { organizationId } = req.user;

      const { data: robots, error } = await supabase
        .from('robots')
        .select(`
          id,
          name,
          status,
          battery_level,
          robot_locations (
            latitude,
            longitude,
            created_at
          )
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { foreignTable: 'robot_locations', ascending: false });

      if (error) throw error;

      const formattedData = robots.map(robot => ({
        id: robot.id,
        name: robot.name,
        status: robot.status,
        batteryLevel: robot.battery_level,
        location: robot.robot_locations[0] || null
      }));

      res.json(formattedData);
    } catch (error) {
      console.error('Error fetching robot locations:', error);
      res.status(500).json({ error: 'Failed to fetch robot locations' });
    }
  },

  async getLocationHistory(req, res) {
    try {
      const { robotId } = req.params;
      const { organizationId } = req.user;
      const { start, end } = req.query;

      let query = supabase
        .from('robot_locations')
        .select('*')
        .eq('robot_id', robotId)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      // Add date filters if provided
      if (start) {
        query = query.gte('created_at', start);
      }
      if (end) {
        query = query.lte('created_at', end);
      }

      const { data, error } = await query;

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('Error fetching location history:', error);
      res.status(500).json({ error: 'Failed to fetch location history' });
    }
  },

  async getRobotErrors(req, res) {
    try {
      const { robotId } = req.params;
      const { organizationId } = req.user;

      const { data: errors, error } = await supabase
        .from('robot_errors')
        .select('*')
        .eq('robot_id', robotId)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(errors);
    } catch (error) {
      console.error('Error fetching robot errors:', error);
      res.status(500).json({ 
        error: 'Failed to fetch robot errors',
        details: error.message 
      });
    }
  },

  async getRobotJobs(req, res) {
    try {
      const { robotId } = req.params;
      const { organizationId } = req.user;

      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('robot_id', robotId)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(jobs);
    } catch (error) {
      console.error('Error fetching robot jobs:', error);
      res.status(500).json({ 
        error: 'Failed to fetch robot jobs',
        details: error.message 
      });
    }
  },

  async getRobotDetails(req, res) {
    try {
      const { robotId } = req.params;
      const { organizationId } = req.user;

      const { data: robot, error } = await supabase
        .from('robots')
        .select('*')
        .eq('id', robotId)
        .eq('organization_id', organizationId)
        .single();

      if (error) throw error;

      res.json(robot);
    } catch (error) {
      console.error('Error fetching robot details:', error);
      res.status(500).json({ 
        error: 'Failed to fetch robot details',
        details: error.message 
      });
    }
  },

  async getRobotErrors(req, res) {
    try {
      const { robotId } = req.params;
      const { organizationId } = req.user;

      const { data: errors, error } = await supabase
        .from('robot_errors')
        .select('*')
        .eq('robot_id', robotId)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(errors);
    } catch (error) {
      console.error('Error fetching robot errors:', error);
      res.status(500).json({ 
        error: 'Failed to fetch robot errors',
        details: error.message 
      });
    }
  }
};

function getTimeframeMs(timeframe) {
  const units = {
    h: 3600000,    // 1 hour in milliseconds
    d: 86400000,   // 1 day in milliseconds
    w: 604800000   // 1 week in milliseconds
  };
  const value = parseInt(timeframe);
  const unit = timeframe.slice(-1);
  return value * (units[unit] || units.h); // default to hours if unit not recognized
}

function calculateBatteryTrend(batteryHistory) {
  if (!batteryHistory.length) return null;
  
  return {
    current: batteryHistory[0]?.battery_level,
    average: batteryHistory.reduce((sum, reading) => sum + reading.battery_level, 0) / batteryHistory.length,
    samples: batteryHistory.length
  };
}

function calculateUptime(batteryData) {
  if (!batteryData?.length) return 0;
  
  const readings = batteryData.length;
  const activeReadings = batteryData.filter(reading => reading.battery_level > 0).length;
  return (activeReadings / readings) * 100;
} 
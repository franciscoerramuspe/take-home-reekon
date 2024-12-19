'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RobotCard from '@/components/robots/RobotCard';
import CreateRobotModal from '@/components/robots/CreateRobotModal';
import RobotMap from '@/components/maps/RobotMap';
import { robotService } from '@/services/robotService';
import { useCustomToast } from '@/hooks/useToast';
import type { Robot } from '@/types/robot';
import { ErrorBoundary } from '@/components/error-boundary';
import { useWebSocket } from '@/contexts/WebSocketContext';

export default function DashboardPage() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  const toast = useCustomToast();
  const { socket } = useWebSocket();

  const fetchRobots = async () => {
    try {
      const [robotsData, locationsData] = await Promise.all([
        robotService.getAllRobots(),
        robotService.getRobotLocations()
      ]);

      // Merge location data with robot data
      const robotsWithLocations = robotsData.map(robot => {
        const locationData = locationsData.find(loc => loc.id === robot.id);
        return {
          ...robot,
          location: locationData?.location
        };
      });

      setRobots(robotsWithLocations);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load robots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Battery updates
    socket.on('robot:battery_update', ({ robotId, batteryLevel }) => {
      setRobots(prevRobots => 
        prevRobots.map(robot => 
          robot.id === robotId 
            ? { ...robot, battery_level: batteryLevel }
            : robot
        )
      );
    });

    // Status updates
    socket.on('robot:status_update', ({ robotId, status }) => {
      setRobots(prevRobots => 
        prevRobots.map(robot => 
          robot.id === robotId 
            ? { ...robot, status }
            : robot
        )
      );
    });

    // Location updates
    socket.on('robot:location_update', ({ robotId, latitude, longitude }) => {
      setRobots(prevRobots => 
        prevRobots.map(robot => 
          robot.id === robotId 
            ? { 
                ...robot, 
                location: { 
                  ...robot.location, 
                  latitude, 
                  longitude,
                  created_at: new Date().toISOString()
                } 
              }
            : robot
        )
      );
    });

    return () => {
      socket.off('robot:battery_update');
      socket.off('robot:status_update');
      socket.off('robot:location_update');
    };
  }, [socket]);

  const handleCreateRobot = async (name: string) => {
    try {
      await robotService.createRobot(name);
      await fetchRobots();
      setIsCreateModalOpen(false);
      toast.success('Robot created successfully');
    } catch (err) {
      console.error('Error creating robot:', err);
      toast.error('Failed to create robot');
      throw err;
    }
  };

  const handleDeleteRobot = async (robotId: string) => {
    if (!confirm('Are you sure you want to delete this robot?')) return;
    
    try {
      await robotService.deleteRobot(robotId);
      await fetchRobots();
      toast.success('Robot deleted successfully');
    } catch (err) {
      console.error('Error deleting robot:', err);
      toast.error('Failed to delete robot');
    }
  };

  const handleUpdateStatus = async (robotId: string, status: string, batteryLevel: number) => {
    try {
      await robotService.updateRobotStatus(robotId, status, batteryLevel);
      await fetchRobots();
      toast.success('Robot status updated successfully');
    } catch (err) {
      console.error('Error updating robot:', err);
      toast.error('Failed to update robot status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Your Robots</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Robot
          </Button>
        </div>

        <div className="mb-6 bg-gray-800 rounded-lg p-4">
          <RobotMap robots={robots.filter(robot => robot.location)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {robots.map((robot) => (
            <RobotCard 
              key={robot.id}
              robot={robot}
              onDelete={handleDeleteRobot}
              onUpdateStatus={handleUpdateStatus}
              onClick={() => router.push(`/dashboard/robots/${robot.id}`)}
            />
          ))}
        </div>

        <CreateRobotModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateRobot}
        />
      </div>
    </ErrorBoundary>
  );
}


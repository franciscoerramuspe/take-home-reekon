'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RobotService, { Robot, robotService } from '@/services/robotService';
import CreateRobotModal from '@/components/robots/CreateRobotModal';
import RobotCard from '@/components/robots/RobotCard';

export default function DashboardPage() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const fetchRobots = async () => {
    try {
      const data = await robotService.getAllRobots();
      setRobots(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load robots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  const handleCreateRobot = async (name: string) => {
    try {
      await robotService.createRobot(name);
      await fetchRobots();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating robot:', err);
      throw err; // This will be caught by the modal's error handling
    }
  };

  const handleDeleteRobot = async (robotId: string) => {
    if (!confirm('Are you sure you want to delete this robot?')) return;
    
    try {
      await robotService.deleteRobot(robotId);
      await fetchRobots();
    } catch (err) {
      console.error('Error deleting robot:', err);
      setError('Failed to delete robot');
    }
  };

  const handleUpdateStatus = async (robotId: string, status: string, batteryLevel: number) => {
    try {
      await robotService.updateRobotStatus(robotId, status, batteryLevel);
      await fetchRobots();
    } catch (err) {
      console.error('Error updating robot:', err);
      setError('Failed to update robot status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Robots Overview</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add Robot
        </button>
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
  );
}


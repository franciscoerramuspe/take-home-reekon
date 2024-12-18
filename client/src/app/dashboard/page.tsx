'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import RobotCard from '@/components/robots/RobotCard';
import CreateRobotModal from '@/components/robots/CreateRobotModal';
import { robotService } from '@/services/robotService';
import { useCustomToast } from '@/hooks/useToast';
import type { Robot } from '@/types/robot';

export default function DashboardPage() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  const toast = useCustomToast();

  const fetchRobots = async () => {
    try {
      const data = await robotService.getAllRobots();
      setRobots(data);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Your Robots</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Robot
        </Button>
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


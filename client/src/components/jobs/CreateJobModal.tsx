'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jobService } from '@/services/jobService';
import { useCustomToast } from '@/hooks/useCustomToast';
import { Plus } from 'lucide-react';
import { JobType } from '@/types/jobs';

interface CreateJobModalProps {
  onJobCreated: () => void;
  robots: Array<{ id: string; name: string }>;
}

export function CreateJobModal({ onJobCreated, robots }: CreateJobModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();

  const [formData, setFormData] = useState({
    robot_id: '',
    type: '' as JobType,
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    location: {
      start: '',
      destination: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await jobService.createJob(formData);
      toast.success('Job created successfully');
      setOpen(false);
      onJobCreated();
      // Reset form
      setFormData({
        robot_id: '',
        type: '' as JobType,
        description: '',
        priority: 'medium',
        location: {
          start: '',
          destination: ''
        }
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Robot</label>
            <Select
              value={formData.robot_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, robot_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Robot" />
              </SelectTrigger>
              <SelectContent>
                {robots.map(robot => (
                  <SelectItem key={robot.id} value={robot.id}>
                    {robot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Job Type</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as JobType }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="charging">Charging</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter job description"
            />
          </div>

          {(formData.type === 'delivery' || formData.type === 'pickup') && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Location</label>
                <Input
                  value={formData.location.start}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, start: e.target.value }
                  }))}
                  placeholder="Enter start location"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Destination</label>
                <Input
                  value={formData.location.destination}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, destination: e.target.value }
                  }))}
                  placeholder="Enter destination"
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Job'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
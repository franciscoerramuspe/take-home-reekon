'use client';

import { useEffect, useState } from 'react';
import { JobsTable } from '@/components/jobs/JobsTable';
import { JobsOverview } from '@/components/jobs/JobsOverview';
import { CreateJobModal } from '@/components/jobs/CreateJobModal';
import { jobService } from '@/services/jobService';
import { robotService } from '@/services/robotService';
import { Job } from '@/types/jobs';
import { useCustomToast } from '@/hooks/useCustomToast';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [robots, setRobots] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const toast = useCustomToast();

  const fetchJobs = async () => {
    try {
      const data = await jobService.listJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRobots = async () => {
    try {
      const data = await robotService.listRobots();
      setRobots(data);
    } catch (error) {
      console.error('Error fetching robots:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchRobots();
    // Set up real-time updates
    const interval = setInterval(fetchJobs, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Management</h1>
        <CreateJobModal 
          onJobCreated={fetchJobs} 
          robots={robots}
        />
      </div>
      <JobsOverview jobs={jobs} />
      <div className="mt-8">
        <JobsTable jobs={jobs} />
      </div>
    </div>
  );
} 
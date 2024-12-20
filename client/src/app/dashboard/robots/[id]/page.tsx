'use client';

import { useEffect, useState, use } from 'react';
import { robotService } from '@/services/robotService';
import { errorService } from '@/services/errorService';
import { jobService } from '@/services/jobService';
import { useCustomToast } from '@/hooks/useCustomToast';
import { RobotDetails } from '@/components/robots/RobotDetails';
import { RobotHistory } from '@/components/robots/RobotHistory';
import { ErrorLogTable } from '@/components/errors/ErrorLogTable';
import { JobsTable } from '@/components/jobs/JobsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Robot } from '@/types/robot';
import { RobotError } from '@/services/errorService';
import { Job } from '@/types/jobs';

export default function RobotPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [robot, setRobot] = useState<Robot | null>(null);
  const [errors, setErrors] = useState<RobotError[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useCustomToast();

  useEffect(() => {
    const fetchRobotData = async () => {
      try {
        const [robotData, robotErrors, robotJobs] = await Promise.all([
          robotService.getRobotDetails(resolvedParams.id),
          errorService.getRobotErrors(resolvedParams.id),
          jobService.getRobotJobs(resolvedParams.id)
        ]);

        setRobot(robotData);
        setErrors(robotErrors);
        setJobs(robotJobs);
      } catch (error) {
        console.error('Error fetching robot data:', error);
        toast.error('Failed to load robot data');
      } finally {
        setLoading(false);
      }
    };

    fetchRobotData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!robot) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Robot not found</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <RobotDetails robot={robot} />
      
      <div className="mt-8">
        <Tabs defaultValue="history" className="w-full">
          <TabsList>
            <TabsTrigger value="history">Activity History</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <RobotHistory errors={errors} jobs={jobs} />
          </TabsContent>

          <TabsContent value="errors">
            <ErrorLogTable errors={errors} />
          </TabsContent>

          <TabsContent value="jobs">
            <JobsTable jobs={jobs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

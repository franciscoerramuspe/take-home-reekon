import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobs";
import { formatDistanceToNow } from 'date-fns';
import { Play, Pause, XCircle } from 'lucide-react';
import { jobService } from '@/services/jobService';
import { useCustomToast } from '@/hooks/useCustomToast';

interface JobsTableProps {
  jobs: Job[];
}

export function JobsTable({ jobs }: JobsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const toast = useCustomToast();

  const handleAction = async (jobId: string, action: 'pause' | 'resume' | 'cancel') => {
    try {
      setLoading(jobId);
      await jobService.updateJobStatus(jobId, action);
      toast.success(`Job ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      toast.error(`Failed to ${action} job`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job ID</TableHead>
            <TableHead>Robot</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.id.slice(0, 8)}</TableCell>
              <TableCell>{job.robot_name || job.robot_id.slice(0, 8)}</TableCell>
              <TableCell className="capitalize">{job.type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  {
                    pending: 'bg-yellow-100 text-yellow-800',
                    in_progress: 'bg-green-100 text-green-800',
                    completed: 'bg-blue-100 text-blue-800',
                    failed: 'bg-red-100 text-red-800',
                    cancelled: 'bg-gray-100 text-gray-800',
                  }[job.status]
                }`}>
                  {job.status.replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{job.progress}%</span>
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {job.status === 'in_progress' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(job.id, 'pause')}
                      disabled={loading === job.id}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {job.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(job.id, 'resume')}
                      disabled={loading === job.id}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  {['pending', 'in_progress'].includes(job.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(job.id, 'cancel')}
                      disabled={loading === job.id}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 
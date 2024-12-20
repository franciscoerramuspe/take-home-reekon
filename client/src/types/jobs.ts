export type JobStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';
export type JobType =
  | 'delivery'
  | 'pickup'
  | 'maintenance'
  | 'charging'
  | 'inspection';

export interface Job {
  id: string;
  robot_id: string;
  robot_name?: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  description: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  estimated_completion?: string;
  priority: 'low' | 'medium' | 'high';
  location?: {
    start: string;
    destination: string;
  };
}

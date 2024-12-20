import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { formatDistanceToNow } from 'date-fns';

interface HistoryItem {
  id: string;
  type: 'error' | 'job';
  title: string;
  status: string;
  timestamp: string;
  description: string;
}

interface RobotHistoryProps {
  errors: any[];
  jobs: any[];
}

export function RobotHistory({ errors, jobs }: RobotHistoryProps) {
  // Combine and sort errors and jobs
  const historyItems: HistoryItem[] = [
    ...errors.map(error => ({
      id: error.id,
      type: 'error' as const,
      title: `Error: ${error.error_type}`,
      status: error.resolved_at ? 'resolved' : 'open',
      timestamp: error.created_at,
      description: error.description
    })),
    ...jobs.map(job => ({
      id: job.id,
      type: 'job' as const,
      title: `Job: ${job.type}`,
      status: job.status,
      timestamp: job.created_at,
      description: job.description
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Timeline>
      {historyItems.map((item) => (
        <TimelineItem
          key={`${item.type}-${item.id}`}
          title={item.title}
          timestamp={formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
          status={item.status}
          type={item.type}
          description={item.description}
        />
      ))}
    </Timeline>
  );
} 
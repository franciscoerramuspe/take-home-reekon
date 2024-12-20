interface TimelineItemProps {
  title: string;
  timestamp: string;
  status: string;
  type: 'error' | 'job';
  description: string;
}

export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      {children}
    </div>
  );
}

export function TimelineItem({ title, timestamp, status, type, description }: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${
          type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`} />
        <div className="flex-1 w-px bg-gray-200" />
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-gray-500">{timestamp}</span>
        </div>
        <p className="mt-1 text-gray-600">{description}</p>
        <span className={`inline-flex mt-2 px-2 py-1 rounded-full text-xs font-medium ${
          status === 'resolved' || status === 'completed' 
            ? 'bg-green-100 text-green-800'
            : status === 'in_progress'
            ? 'bg-blue-100 text-blue-800'
            : status === 'failed'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
} 
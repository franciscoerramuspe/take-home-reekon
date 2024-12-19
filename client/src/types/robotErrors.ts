export interface RobotError {
  id: string;
  robot_id: string;
  robot_name?: string;
  error_type:
    | 'software'
    | 'hardware'
    | 'connectivity'
    | 'operational'
    | 'system_error';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  resolved_at?: string;
  resolution?: string;
}

export interface ErrorAnalytics {
  totalErrors: number;
  errorsByType: {
    [key: string]: number;
  };
  errorsBySeverity: {
    [key: string]: number;
  };
  crashFrequency: {
    date: string;
    count: number;
  }[];
  averageResolutionTime?: string;
}

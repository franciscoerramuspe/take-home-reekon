export interface RobotError {
  id: string;
  robot_id: string;
  error_type: 'crash' | 'system_error' | 'connection_loss' | 'hardware_failure';
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

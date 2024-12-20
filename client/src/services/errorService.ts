const API_URL = process.env.NEXT_DEPLOY_URL;

export interface RobotError {
  id: string;
  robot_id: string;
  error_type: string;
  description: string;
  severity: string;
  created_at: string;
  resolved_at: string | null;
}

export interface ErrorAnalytics {
  total: number;
  resolved: number;
  by_severity: {
    high: number;
    medium: number;
    low: number;
  };
  by_type: Record<string, number>;
}

export class ErrorService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async getErrorAnalytics(timeframe: string = '7d'): Promise<ErrorAnalytics> {
    // Validate timeframe format
    const validTimeframe = timeframe.match(/^\d+[dhw]$|^all$/)
      ? timeframe
      : '7d';

    const response = await fetch(
      `${API_URL}/errors/analytics?timeframe=${validTimeframe}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to fetch error analytics');
    }

    return response.json();
  }

  async createErrorReport(
    robotId: string,
    errorType: string,
    description: string,
    severity: string
  ): Promise<RobotError> {
    const response = await fetch(`${API_URL}/api/errors`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        robot_id: robotId,
        error_type: errorType,
        description,
        severity,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create error report');
    }

    return response.json();
  }

  async getRobotErrors(robotId: string) {
    const response = await fetch(`${API_URL}/robots/${robotId}/errors`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch robot errors');
    }

    return response.json();
  }
}

export const errorService = new ErrorService();

const API_URL = process.env.NEXT_DEPLOY_URL;

export interface Robot {
  id: string;
  name: string;
  organization_id: string;
  status: 'online' | 'offline' | 'maintenance';
  battery_level: number;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export interface RobotAnalytics {
  currentStatus: {
    status: string;
    batteryLevel: number;
    lastActive: string;
  };
  taskStats: Array<{
    status: string;
    count: number;
  }>;
  batteryTrend: {
    current: number;
    average: number;
    samples: number;
  } | null;
}

export default class RobotService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getAllRobots(): Promise<Robot[]> {
    const response = await fetch(
      `https://take-home-reekon.vercel.app/api/robots`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch robots');
    }

    return response.json();
  }

  async createRobot(
    name: string,
    location: { latitude: number; longitude: number }
  ): Promise<Robot> {
    console.log('Creating robot with name:', name);
    console.log('API URL:', `${API_URL}/robots`);

    const headers = this.getHeaders();
    console.log('Headers:', headers);

    const response = await fetch(`${API_URL}/robots`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        name,
        location,
        status: 'offline', // Set initial status
        battery_level: 100, // Set initial battery level
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Create robot error:', error);
      throw new Error(
        `Failed to create robot: ${error.message || response.statusText}`
      );
    }

    const robot = await response.json();

    // Create initial location for the robot
    await fetch(`${API_URL}/robots/${robot.id}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });

    return robot;
  }

  async updateRobotStatus(
    robotId: string,
    status: string,
    batteryLevel: number
  ): Promise<Robot> {
    const response = await fetch(`${API_URL}/robots/${robotId}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, batteryLevel }),
    });

    if (!response.ok) {
      throw new Error('Failed to update robot status');
    }

    return response.json();
  }

  async assignTask(
    robotId: string,
    taskType: string,
    parameters: Record<string, unknown>,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<{ id: string; status: string }> {
    const response = await fetch(`${API_URL}/robots/${robotId}/tasks`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ taskType, parameters, priority }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign task');
    }

    return response.json();
  }

  async deleteRobot(robotId: string): Promise<void> {
    const response = await fetch(`${API_URL}/robots/${robotId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete robot');
    }
  }

  async updateRobotLocation(
    robotId: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    const response = await fetch(`${API_URL}/robots/${robotId}/location`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error('Failed to update robot location');
    }
  }

  async getRobotLocations(): Promise<Robot[]> {
    const response = await fetch(
      `https://take-home-reekon.vercel.app/api/robots/locations`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch robot locations');
    }

    const data = await response.json();
    return data.map((robot: any) => ({
      ...robot,
      location: robot.location
        ? {
            latitude: robot.location.latitude,
            longitude: robot.location.longitude,
          }
        : null,
    }));
  }

  async listRobots() {
    const response = await fetch(`${API_URL}/robots`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch robots');
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

  async getRobotJobs(robotId: string) {
    const response = await fetch(`${API_URL}/robots/${robotId}/jobs`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch robot jobs');
    }

    return response.json();
  }

  async getRobotDetails(robotId: string) {
    const response = await fetch(`${API_URL}/robots/${robotId}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getRobotLocation(robotId: string) {
    const response = await fetch(`${API_URL}/robots/${robotId}/location`, {
      headers: this.getHeaders(),
    });

    if (!response.ok && response.status !== 404) {
      throw new Error('Failed to fetch robot location');
    }

    if (response.status === 404) {
      return null;
    }

    return response.json();
  }
}

export const robotService = new RobotService();

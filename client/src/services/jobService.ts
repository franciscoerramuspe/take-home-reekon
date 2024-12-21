import { Job } from '@/types/jobs';

const API_URL = 'https://take-home-reekon.vercel.app/api';

class JobService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async listJobs(): Promise<Job[]> {
    const response = await fetch(`${API_URL}/jobs`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  }

  async updateJobStatus(
    jobId: string,
    action: 'pause' | 'resume' | 'cancel'
  ): Promise<Job> {
    const response = await fetch(`${API_URL}/jobs/${jobId}/${action}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${action} job`);
    }

    return response.json();
  }

  async createJob(jobData: Partial<Job>): Promise<Job> {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error('Failed to create job');
    }

    return response.json();
  }

  async getJobDetails(jobId: string): Promise<Job> {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job details');
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
}

export const jobService = new JobService();

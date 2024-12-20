import supabase from '../../db/supabase.js';

class JobController {
  async listJobs(req, res) {
    try {
      const { organizationId } = req.user;
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
          *,
          robots:robot_id (
            name
          )
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedJobs = jobs.map(job => ({
        ...job,
        robot_name: job.robots?.name
      }));

      res.json(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ 
        error: 'Failed to fetch jobs',
        details: error.message 
      });
    }
  }

  async getJobDetails(req, res) {
    try {
      const { jobId } = req.params;
      const { organizationId } = req.user;

      const { data: job, error } = await supabase
        .from('jobs')
        .select(`
          *,
          robots:robot_id (
            name
          )
        `)
        .eq('id', jobId)
        .eq('organization_id', organizationId)
        .single();

      if (error) throw error;

      res.json({
        ...job,
        robot_name: job.robots?.name
      });
    } catch (error) {
      console.error('Error fetching job details:', error);
      res.status(500).json({ 
        error: 'Failed to fetch job details',
        details: error.message 
      });
    }
  }

  async createJob(req, res) {
    try {
      const { organizationId } = req.user;
      const jobData = {
        ...req.body,
        organization_id: organizationId,
        status: 'pending',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: job, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(job);
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ 
        error: 'Failed to create job',
        details: error.message 
      });
    }
  }

  async updateJobStatus(req, res) {
    try {
      const { jobId, action } = req.params;
      const { organizationId } = req.user;

      let newStatus;
      switch (action) {
        case 'pause':
          newStatus = 'pending';
          break;
        case 'resume':
          newStatus = 'in_progress';
          break;
        case 'cancel':
          newStatus = 'cancelled';
          break;
        default:
          throw new Error('Invalid action');
      }

      const { data: job, error } = await supabase
        .from('jobs')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('organization_id', organizationId)
        .select()
        .single();

      if (error) throw error;

      res.json(job);
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ 
        error: 'Failed to update job',
        details: error.message 
      });
    }
  }
}

export default new JobController(); 
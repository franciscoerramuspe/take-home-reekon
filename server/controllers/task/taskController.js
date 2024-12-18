import supabase from '../../db/supabase.js';

class TaskController {
  async createTask(req, res) {
    try {
      const { robotId, taskDetails } = req.body;
      
      const { data: task, error } = await supabase
        .from('tasks')
        .insert([{
          robotId,
          organizationId: req.user.organizationId,
          assignedBy: req.user.id,
          ...taskDetails
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new TaskController(); 
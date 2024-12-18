import supabase from '../../db/supabase.js';

export const robotController = {
  async createRobot(req, res) {
    try {
      const { name } = req.body;
      const { organizationId } = req.user;

      const { data: robot, error } = await supabase
        .from('robots')
        .insert([
          {
            name,
            organization_id: organizationId,
            status: 'offline',
            battery_level: 100,
            last_active: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      res.status(201).json(robot);
    } catch (error) {
      console.error('Error creating robot:', error);
      res.status(500).json({ error: 'Failed to create robot' });
    }
  },

  async getRobots(req, res) {
    try {
      const { organizationId } = req.user;

      const { data: robots, error } = await supabase
        .from('robots')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(robots);
    } catch (error) {
      console.error('Error fetching robots:', error);
      res.status(500).json({ error: 'Failed to fetch robots' });
    }
  }
}; 
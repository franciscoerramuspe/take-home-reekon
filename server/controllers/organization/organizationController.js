import supabase from '../../db/supabase.js';

class OrganizationController {
  async register(req, res) {
    try {
      const { name, subscription = 'basic', maxRobots = 5 } = req.body;

      if (!name) {
        return res.status(400).json({
          error: 'Organization name is required'
        });
      }

      const { data: organization, error } = await supabase
        .from('organizations')
        .insert([
          {
            name,
            subscription,
            max_robots: maxRobots,
            settings: {
              allowed_features: [],
              api_keys: []
            }
          }
        ])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: 'Organization registered successfully',
        organization
      });
    } catch (error) {
      console.error('Organization registration error:', error);
      res.status(500).json({
        error: error.message || 'Internal server error'
      });
    }
  }

  async list(req, res) {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*');

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('List organizations error:', error);
      res.status(500).json({
        error: error.message || 'Internal server error'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = {};
      
      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.max_robots !== undefined) updates.max_robots = req.body.max_robots;
      if (req.body.subscription !== undefined) updates.subscription = req.body.subscription;
      // Include this so that the settings field is updated
      if (req.body.settings !== undefined) updates.settings = req.body.settings;
  
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select();
  
      if (error) throw error;
  
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Organization not found' });
      }
  
      res.json(data[0]);
    } catch (error) {
      console.error('Update organization error:', error);
      res.status(500).json({
        error: error.message || 'Internal server error'
      });
    }
  }
}

export default new OrganizationController(); 
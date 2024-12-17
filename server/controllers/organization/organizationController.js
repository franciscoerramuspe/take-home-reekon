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
}

export default new OrganizationController(); 
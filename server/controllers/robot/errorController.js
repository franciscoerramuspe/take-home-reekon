import supabase from '../../db/supabase.js';

export const errorController = {
  async createErrorReport(req, res) {
    try {
      const { robotId } = req.params;
      const { error_type, description, severity } = req.body;
      const { organizationId } = req.user;

      const { data: error, error: createError } = await supabase
        .from('robot_errors')
        .insert([{
          robot_id: robotId,
          organization_id: organizationId,
          error_type,
          description,
          severity,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) throw createError;
      res.status(201).json(error);
    } catch (error) {
      console.error('Error creating error report:', error);
      res.status(500).json({ error: 'Failed to create error report' });
    }
  },

  async getErrorAnalytics(req, res) {
    try {
      const { robotId } = req.params;
      const { organizationId } = req.user;
      const { timeframe = '7d' } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeframe));

      // Get all errors for the specified timeframe
      const { data: errors, error: fetchError } = await supabase
        .from('robot_errors')
        .select('*')
        .eq('robot_id', robotId)
        .eq('organization_id', organizationId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Process the data for analytics
      const analytics = {
        totalErrors: errors.length,
        errorsByType: {},
        errorsBySeverity: {},
        crashFrequency: []
      };

      // Group errors by date for crash frequency
      const errorsByDate = {};
      errors.forEach(error => {
        const date = error.created_at.split('T')[0];
        errorsByDate[date] = (errorsByDate[date] || 0) + 1;
        
        // Count by type
        analytics.errorsByType[error.error_type] = (analytics.errorsByType[error.error_type] || 0) + 1;
        
        // Count by severity
        analytics.errorsBySeverity[error.severity] = (analytics.errorsBySeverity[error.severity] || 0) + 1;
      });

      // Convert errorsByDate to array format
      analytics.crashFrequency = Object.entries(errorsByDate).map(([date, count]) => ({
        date,
        count
      }));

      res.json(analytics);
    } catch (error) {
      console.error('Error fetching error analytics:', error);
      res.status(500).json({ error: 'Failed to fetch error analytics' });
    }
  }
}; 
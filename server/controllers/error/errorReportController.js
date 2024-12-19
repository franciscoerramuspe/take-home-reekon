import supabase from '../../db/supabase.js';

// Move the helper function outside the class
const formatDuration = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

class ErrorReportController {
  async listErrors(req, res) {
    try {
      const { data: errors, error } = await supabase
        .from('robot_errors')
        .select('*')
        .eq('organization_id', req.user.organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(errors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getErrorAnalytics(req, res) {
    try {
      const { organizationId } = req.user;
      const { timeframe = '7d' } = req.query;

      let startDate = new Date();
      
      // Parse timeframe
      if (timeframe === 'all') {
        startDate = new Date(0);
      } else {
        const value = parseInt(timeframe);
        const unit = timeframe.slice(-1);
        
        switch(unit) {
          case 'd':
            startDate.setDate(startDate.getDate() - value);
            break;
          case 'h':
            startDate.setHours(startDate.getHours() - value);
            break;
          case 'w':
            startDate.setDate(startDate.getDate() - (value * 7));
            break;
          default:
            startDate.setDate(startDate.getDate() - 7);
        }
      }

      const { data: errors, error } = await supabase
        .from('robot_errors')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const analytics = {
        totalErrors: errors.length,
        errorsByType: {},
        errorsBySeverity: {},
        crashFrequency: []
      };

      // Process errors by date
      const errorsByDate = {};
      errors.forEach(error => {
        const date = error.created_at.split('T')[0];
        errorsByDate[date] = (errorsByDate[date] || 0) + 1;
        
        analytics.errorsByType[error.error_type] = (analytics.errorsByType[error.error_type] || 0) + 1;
        analytics.errorsBySeverity[error.severity] = (analytics.errorsBySeverity[error.severity] || 0) + 1;
      });

      // Calculate average resolution time
      const resolvedErrors = errors.filter(error => error.resolved_at);
      if (resolvedErrors.length > 0) {
        const totalResolutionTime = resolvedErrors.reduce((sum, error) => {
          const resolutionTime = new Date(error.resolved_at).getTime() - new Date(error.created_at).getTime();
          return sum + resolutionTime;
        }, 0);
        
        const avgTimeMs = totalResolutionTime / resolvedErrors.length;
        analytics.averageResolutionTime = formatDuration(avgTimeMs);
      }

      analytics.crashFrequency = Object.entries(errorsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      res.json(analytics);
    } catch (error) {
      console.error('Error in getErrorAnalytics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch error analytics',
        details: error.message 
      });
    }
  }
}

export default new ErrorReportController(); 
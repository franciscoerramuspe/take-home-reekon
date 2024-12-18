import supabase from '../../db/supabase.js';

class ErrorReportController {
  async listErrors(req, res) {
    try {
      const { data: errors, error } = await supabase
        .from('error_reports')
        .select('*')
        .eq('organizationId', req.user.organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(errors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ErrorReportController(); 
import jwt from 'jsonwebtoken';
import supabase from '../db/supabase.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Get user with organization details
    const { data: user, error } = await supabase
      .from('users')
      .select('*, organizations(*)')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      console.log('User fetch error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      organizationId: user.organizationId || user.organization_id
    };

    console.log('User data attached to request:', req.user);

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

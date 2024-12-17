import bcrypt from 'bcryptjs';
import supabase from '../../db/supabase.js';

class AuthController {
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, organizationId } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName || !organizationId) {
        return res.status(400).json({ 
          error: 'All fields are required' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Invalid email format' 
        });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({ 
          error: 'Password must be at least 8 characters long' 
        });
      }

      // Check if organization exists
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', organizationId)
        .single();

      if (orgError || !organization) {
        return res.status(404).json({ 
          error: 'Organization not found' 
        });
      }

      // Check if user already exists
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ 
          error: 'Email already registered' 
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const { data: user, error: createError } = await supabase
        .from('users')
        .insert([
          {
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            organizationId,
            role: 'operator',
            status: 'active',
            preferences: {
              notifications: {
                email: true,
                push: true
              },
              dashboard_layout: {}
            }
          }
        ])
        .select()
        .single();

      if (createError) throw createError;

      // Remove password from response
      delete user.password;

      res.status(201).json({
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: error.message || 'Internal server error' 
      });
    }
  }
}

export default new AuthController();

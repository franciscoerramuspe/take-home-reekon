import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import Organization from '../../models/Organization.js';

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
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ 
          error: 'Organization not found' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Email already registered' 
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        organization: organizationId,
        role: 'operator'
      });

      await user.save();

      // Return user without password
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }
}

export default new AuthController();

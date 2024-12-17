import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'operator', 'viewer'],
    default: 'operator'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    dashboardLayout: {
      type: Map,
      of: String,
      default: {}
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1, organization: 1 });

const User = mongoose.model('User', userSchema);

export default User;
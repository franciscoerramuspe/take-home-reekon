import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subscription: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  maxRobots: {
    type: Number,
    default: 5
  },
  settings: {
    allowedFeatures: [String],
    apiKeys: [String]
  }
}, {
  timestamps: true
});

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;
import mongoose from 'mongoose';

const robotSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'error'],
    default: 'active'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  currentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  lastMaintenance: Date,
  batteryLevel: Number
}, {
  timestamps: true
});

robotSchema.index({ location: '2dsphere' }); 
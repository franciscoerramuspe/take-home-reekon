import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  robot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Robot',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startTime: Date,
  completionTime: Date
}, {
  timestamps: true
}); 
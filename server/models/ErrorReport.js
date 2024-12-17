import mongoose from 'mongoose';

const errorReportSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['hardware', 'software', 'connectivity', 'operational'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  description: String,
  stackTrace: String,
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date
}, {
  timestamps: true
});

errorReportSchema.index({ organization: 1, createdAt: -1 }); 
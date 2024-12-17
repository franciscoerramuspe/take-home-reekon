import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  type: {
    type: String,
    enum: ['robot_usage', 'error_frequency', 'task_completion', 'user_activity'],
    required: true
  },
  metrics: {
    type: Map,
    of: Number,
    required: true
  },
  timeframe: {
    start: Date,
    end: Date
  }
}, {
  timestamps: true
});

analyticsSchema.index({ organization: 1, type: 1, 'timeframe.start': -1 }); 
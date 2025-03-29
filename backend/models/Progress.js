const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  completion_status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  score: {
    type: Number,
    default: 0
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  discipline: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan; 
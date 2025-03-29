const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  discipline: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  format: {
    type: String,
    enum: ['text', 'image', 'audio'],
    required: true
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  },
  knowledge_tags: [{
    type: String
  }],
  content_text: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content; 
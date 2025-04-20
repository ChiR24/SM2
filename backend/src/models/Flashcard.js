const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlashcardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  front: {
    type: String,
    required: true,
    trim: true
  },
  back: {
    type: String,
    required: true,
    trim: true
  },
  // SM2 algorithm parameters
  interval: {
    type: Number,
    default: 0
  },
  repetition: {
    type: Number,
    default: 0
  },
  efactor: {
    type: Number,
    default: 2.5
  },
  nextReviewDate: {
    type: Date,
    default: Date.now
  },
  lastReviewDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying of cards due for review
FlashcardSchema.index({ user: 1, nextReviewDate: 1 });

module.exports = mongoose.model('Flashcard', FlashcardSchema);

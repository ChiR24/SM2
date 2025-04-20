const Flashcard = require('../models/Flashcard');
const { sm2Algorithm } = require('../utils/sm2Algorithm');

// Get all flashcards for a user
exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get flashcards due for review
exports.getDueFlashcards = async (req, res) => {
  try {
    const now = new Date();
    const dueFlashcards = await Flashcard.find({
      user: req.user.id,
      nextReviewDate: { $lte: now }
    }).sort({ nextReviewDate: 1 });

    res.json(dueFlashcards);
  } catch (error) {
    console.error('Error fetching due flashcards:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new flashcard
exports.createFlashcard = async (req, res) => {
  try {
    const { front, back } = req.body;

    if (!front || !back) {
      return res.status(400).json({ message: 'Front and back are required' });
    }

    const newFlashcard = new Flashcard({
      user: req.user.id,
      front,
      back,
      // Default SM2 values are set in the model
    });

    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a flashcard
exports.updateFlashcard = async (req, res) => {
  try {
    const { front, back } = req.body;
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    // Check if the flashcard belongs to the user
    if (flashcard.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    if (front) flashcard.front = front;
    if (back) flashcard.back = back;

    const updatedFlashcard = await flashcard.save();
    res.json(updatedFlashcard);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const result = await Flashcard.deleteOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Flashcard not found or not authorized' });
    }

    res.json({ message: 'Flashcard removed' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Review a flashcard and update its SM2 parameters
exports.reviewFlashcard = async (req, res) => {
  try {
    const { grade } = req.body;

    if (grade === undefined || grade < 0 || grade > 5) {
      return res.status(400).json({ message: 'Valid grade (0-5) is required' });
    }

    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    // Check if the flashcard belongs to the user
    if (flashcard.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Apply SM2 algorithm
    const { interval, repetition, efactor, nextReviewDate } = sm2Algorithm(
      {
        interval: flashcard.interval,
        repetition: flashcard.repetition,
        efactor: flashcard.efactor
      },
      grade
    );

    // Update flashcard with new SM2 parameters
    flashcard.interval = interval;
    flashcard.repetition = repetition;
    flashcard.efactor = efactor;
    flashcard.lastReviewDate = new Date();
    flashcard.nextReviewDate = nextReviewDate;

    const updatedFlashcard = await flashcard.save();
    res.json(updatedFlashcard);
  } catch (error) {
    console.error('Error reviewing flashcard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

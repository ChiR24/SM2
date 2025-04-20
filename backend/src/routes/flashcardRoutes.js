const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');
const auth = require('../middleware/auth');

// @route   GET /api/flashcards
// @desc    Get all flashcards for a user
// @access  Private
router.get('/', auth, flashcardController.getFlashcards);

// @route   GET /api/flashcards/due
// @desc    Get flashcards due for review
// @access  Private
router.get('/due', auth, flashcardController.getDueFlashcards);

// @route   POST /api/flashcards
// @desc    Create a new flashcard
// @access  Private
router.post('/', auth, flashcardController.createFlashcard);

// @route   PUT /api/flashcards/:id
// @desc    Update a flashcard
// @access  Private
router.put('/:id', auth, flashcardController.updateFlashcard);

// @route   DELETE /api/flashcards/:id
// @desc    Delete a flashcard
// @access  Private
router.delete('/:id', auth, flashcardController.deleteFlashcard);

// @route   POST /api/flashcards/:id/review
// @desc    Review a flashcard and update SM2 parameters
// @access  Private
router.post('/:id/review', auth, flashcardController.reviewFlashcard);

module.exports = router;

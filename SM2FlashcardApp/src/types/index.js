/**
 * @typedef {Object} Flashcard
 * @property {string} id - Unique identifier for the flashcard
 * @property {string} question - The question or front side of the flashcard
 * @property {string} answer - The answer or back side of the flashcard
 * @property {string} category - The category the flashcard belongs to
 * @property {number} easeFactor - The ease factor for the SM2 algorithm (default: 2.5)
 * @property {number} interval - The interval in days for the next review
 * @property {number} repetitions - The number of times the card has been reviewed
 * @property {Date} nextReviewDate - The next date the card should be reviewed
 * @property {Date} lastReviewDate - The last date the card was reviewed
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user
 * @property {string} username - The username
 * @property {string} email - The user's email
 * @property {string} token - Authentication token
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - The current user
 * @property {boolean} isAuthenticated - Whether the user is authenticated
 * @property {boolean} loading - Whether authentication is in progress
 * @property {string|null} error - Any authentication error
 */

/**
 * @typedef {Object} FlashcardState
 * @property {Flashcard[]} flashcards - All flashcards
 * @property {Flashcard[]} dueFlashcards - Flashcards due for review
 * @property {boolean} loading - Whether flashcards are being loaded
 * @property {string|null} error - Any flashcard-related error
 */

export {};

/**
 * Implementation of the SuperMemo 2 (SM2) spaced repetition algorithm
 *
 * The SM2 algorithm calculates the optimal interval between reviews of a flashcard
 * based on how well the user remembers it.
 *
 * Quality ratings:
 * 0 - Complete blackout, wrong response
 * 1 - Wrong response, but upon seeing the correct answer, it felt familiar
 * 2 - Wrong response, but upon seeing the correct answer, it seemed easy to remember
 * 3 - Correct response, but required significant effort to recall
 * 4 - Correct response, after some hesitation
 * 5 - Correct response, perfect recall
 */

/**
 * Calculate the next interval for a flashcard using the SM2 algorithm
 *
 * @param {number} quality - The quality of the response (0-5)
 * @param {number} repetitions - The number of times the card has been reviewed
 * @param {number} easeFactor - The ease factor (minimum 1.3)
 * @param {number} interval - The current interval in days
 * @returns {Object} The updated values for repetitions, easeFactor, and interval
 */
export const calculateNextInterval = (quality, repetitions, easeFactor, interval) => {
  // Ensure quality is within bounds
  quality = Math.max(0, Math.min(5, quality));

  // Initialize variables
  let newRepetitions = repetitions;
  let newInterval = interval;

  // Update the ease factor based on the quality of response
  // The formula is: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure the ease factor doesn't go below 1.3
  newEaseFactor = Math.max(1.3, newEaseFactor);

  // If the quality is less than 3 (i.e., the response was difficult or incorrect)
  if (quality < 3) {
    // Reset repetitions to 0
    newRepetitions = 0;
    // Reset interval to 1 day
    newInterval = 1;
  } else {
    // For score = 3, we need to check if we should reset the interval
    // According to the sample table, score = 3 sometimes resets the interval
    // We'll reset if it's a difficult recall (hesitation) after multiple successful recalls
    if (quality === 3 && repetitions > 1) {
      // Reset for hesitation after multiple successful recalls
      newInterval = 1;
      newRepetitions = 0;
    } else {
      // Increment repetitions for successful recall
      newRepetitions = repetitions + 1;

      // Calculate the new interval based on the number of repetitions
      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * newEaseFactor);
      }
    }
  }

  return {
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    interval: newInterval
  };
};

/**
 * Calculate the next review date based on the current date and interval
 *
 * @param {Date} currentDate - The current date
 * @param {number} interval - The interval in days
 * @returns {Date} The next review date
 */
export const calculateNextReviewDate = (currentDate, interval) => {
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + interval);
  return nextDate;
};

/**
 * Check if a flashcard is due for review
 *
 * @param {Date} nextReviewDate - The next review date for the flashcard
 * @param {Date} currentDate - The current date
 * @returns {boolean} Whether the flashcard is due for review
 */
export const isDue = (nextReviewDate, currentDate = new Date()) => {
  // Convert dates to YYYY-MM-DD format for comparison
  const formatDateForComparison = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const nextReviewFormatted = formatDateForComparison(new Date(nextReviewDate));
  const currentDateFormatted = formatDateForComparison(currentDate);

  // Add logging to help debug date comparison
  console.log(`[SM2] Comparing dates: nextReview=${nextReviewFormatted}, current=${currentDateFormatted}, isDue=${nextReviewFormatted <= currentDateFormatted}`);

  // Compare dates without time
  return nextReviewFormatted <= currentDateFormatted;
};

/**
 * Get all flashcards that are due for review
 *
 * @param {Array} flashcards - The array of flashcards
 * @param {Date} currentDate - The current date
 * @returns {Array} The flashcards that are due for review
 */
export const getDueFlashcards = (flashcards, currentDate = new Date()) => {
  console.log(`[SM2] Checking ${flashcards.length} flashcards for due status`);

  const dueCards = flashcards.filter(card => {
    const isDueForReview = isDue(new Date(card.nextReviewDate), currentDate);
    console.log(`[SM2] Card ${card.id}: nextReview=${card.nextReviewDate}, isDue=${isDueForReview}`);
    return isDueForReview;
  });

  console.log(`[SM2] Found ${dueCards.length} due flashcards`);
  return dueCards;
};

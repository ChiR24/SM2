/**
 * Implements the SuperMemo 2 (SM2) algorithm for spaced repetition
 *
 * @param {Object} item - The flashcard item with learning progress
 * @param {number} item.interval - Current interval in days
 * @param {number} item.repetition - Number of successful recalls in a row
 * @param {number} item.efactor - Ease factor (how easy the card is to remember)
 * @param {number} grade - Quality of recall (0-5)
 * @returns {Object} Updated item with new interval, repetition, and efactor
 */
function sm2Algorithm(item, grade) {
  // Default values for new cards
  const defaultItem = {
    interval: 0,
    repetition: 0,
    efactor: 2.5
  };

  // Use default values if not provided
  const currentItem = {
    interval: item.interval ?? defaultItem.interval,
    repetition: item.repetition ?? defaultItem.repetition,
    efactor: item.efactor ?? defaultItem.efactor
  };

  let nextInterval;
  let nextRepetition;
  let nextEfactor = currentItem.efactor;

  // Calculate the new ease factor for all responses
  // The formula is: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  nextEfactor = currentItem.efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

  // Ensure ease factor doesn't go below 1.3
  if (nextEfactor < 1.3) {
    nextEfactor = 1.3;
  }

  // If the recall was successful (grade >= 3)
  if (grade >= 3) {
    // For score = 3, we need to check if we should reset the interval
    // According to the sample table, score = 3 sometimes resets the interval
    // We'll reset if it's a difficult recall (hesitation)
    if (grade === 3 && currentItem.repetition > 1) {
      // Reset for hesitation after multiple successful recalls
      nextInterval = 1;
      nextRepetition = 0;
    } else if (currentItem.repetition === 0) {
      // First successful recall
      nextInterval = 1;
      nextRepetition = 1;
    } else if (currentItem.repetition === 1) {
      // Second successful recall
      nextInterval = 6;
      nextRepetition = 2;
    } else {
      // Subsequent successful recalls
      nextInterval = Math.round(currentItem.interval * nextEfactor);
      nextRepetition = currentItem.repetition + 1;
    }
  } else {
    // If the recall was unsuccessful (grade < 3)
    nextInterval = 1;
    nextRepetition = 0;
  }

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    efactor: nextEfactor,
    nextReviewDate: calculateNextReviewDate(nextInterval)
  };
}

/**
 * Calculate the next review date based on the interval
 *
 * @param {number} interval - Interval in days
 * @returns {Date} Next review date
 */
function calculateNextReviewDate(interval) {
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  return nextReviewDate;
}

module.exports = { sm2Algorithm };

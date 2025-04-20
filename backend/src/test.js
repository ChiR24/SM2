const { sm2Algorithm } = require('./utils/sm2Algorithm');

// Test the SM2 algorithm with a sequence of reviews
console.log('Testing SM2 Algorithm Implementation');
console.log('====================================');

// Initial state for a new flashcard
let flashcard = {
  interval: 0,
  repetition: 0,
  efactor: 2.5
};

console.log('Initial state:', flashcard);

// Simulate a sequence of reviews with different grades
const reviews = [
  { grade: 5, description: 'Perfect recall' },
  { grade: 4, description: 'Correct after hesitation' },
  { grade: 3, description: 'Correct with difficulty' },
  { grade: 2, description: 'Incorrect, but familiar' },
  { grade: 5, description: 'Perfect recall' },
  { grade: 4, description: 'Correct after hesitation' },
  { grade: 5, description: 'Perfect recall' },
  { grade: 5, description: 'Perfect recall' },
  { grade: 3, description: 'Correct with difficulty' },
  { grade: 4, description: 'Correct after hesitation' }
];

// Process each review
for (let i = 0; i < reviews.length; i++) {
  const { grade, description } = reviews[i];
  
  console.log(`\nReview ${i + 1} - Grade: ${grade} (${description})`);
  
  // Apply SM2 algorithm
  flashcard = sm2Algorithm(flashcard, grade);
  
  // Display updated state
  console.log('Updated state:');
  console.log('- Interval:', flashcard.interval, 'days');
  console.log('- Repetition:', flashcard.repetition);
  console.log('- EFactor:', flashcard.efactor.toFixed(2));
  console.log('- Next review date:', flashcard.nextReviewDate.toDateString());
}

console.log('\nTest completed successfully!');

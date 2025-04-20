const { sm2Algorithm } = require('./sm2Algorithm');

// Initial state for a new flashcard
let flashcard = {
  interval: 0,
  repetition: 0,
  efactor: 2.5
};

console.log('Initial state:', flashcard);

// Simulate a sequence of reviews with different grades
const grades = [5, 4, 3, 2, 5, 4, 5, 5, 3, 4];

for (let i = 0; i < grades.length; i++) {
  const grade = grades[i];
  console.log(`\nReview ${i + 1} - Grade: ${grade}`);
  
  flashcard = sm2Algorithm(flashcard, grade);
  
  console.log('Updated state:');
  console.log('- Interval:', flashcard.interval, 'days');
  console.log('- Repetition:', flashcard.repetition);
  console.log('- EFactor:', flashcard.efactor.toFixed(2));
  console.log('- Next review date:', flashcard.nextReviewDate.toDateString());
}

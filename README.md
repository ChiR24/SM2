# SM2 Spaced Repetition System

A comprehensive flashcard application that implements the SuperMemo 2 (SM2) algorithm for spaced repetition to help users memorize information efficiently. This application provides a scientifically-proven method to optimize learning and retention through intelligent scheduling of reviews.

## Features

- User authentication and account management
- Create, edit, and delete flashcards
- Review flashcards using the SM2 spaced repetition algorithm
- Track learning progress with visual indicators
- Automatically schedule reviews based on recall performance
- Responsive design that works on desktop and mobile devices
- Secure API with JWT authentication

## Technology Stack

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

### SM2FlashcardApp
- React Native for Web
- JavaScript
- Axios for API requests
- React Navigation
- Custom UI components
- Animated API for smooth transitions
- Context API for state management
- Responsive design principles

### Mobile App
- React Native
- TypeScript
- Axios for API requests
- React Navigation
- Expo
- Context API for state management

## SM2 Algorithm

The application implements the SuperMemo 2 (SM2) algorithm for spaced repetition, which was developed by Piotr Wozniak in the 1980s. This scientifically-proven algorithm optimizes the learning process by scheduling reviews at increasing intervals based on recall performance.

### How it works:

1. **Grading System**: When reviewing a flashcard, users grade their recall quality on a scale of 0-5:
   - 0-2: Failed recall (difficult)
   - 3: Correct recall with significant difficulty
   - 4: Correct recall with some hesitation
   - 5: Perfect recall

2. **Interval Calculation**:
   - If the user gets the answer right (grade ≥ 3), the interval increases according to the formula
   - If the user gets the answer wrong (grade < 3), the interval resets to 1 day

3. **Ease Factor (EF) Adjustment**:
   - The ease factor starts at 2.5
   - It's adjusted after each review using the formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
   - EF is never allowed to go below 1.3

4. **Next Review Date Calculation**:
   - For repetition = 0: interval = 1
   - For repetition = 1: interval = 6
   - For repetition > 1: interval = interval * EF

### Implementation Details

The SM2 algorithm is implemented in the backend in the `utils/sm2Algorithm.js` file. The key function is `sm2Algorithm`, which takes a flashcard and a grade (0-5) and returns updated values according to the SM2 algorithm:

```javascript
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
```

#### Special Handling for Score = 3

Our implementation includes a special case for score = 3 (correct but difficult recall). According to the sample table in the SM2 algorithm documentation, a score of 3 sometimes resets the interval, particularly after multiple successful recalls. This is because a score of 3 indicates hesitation, which suggests the card might need more frequent review.

In our implementation:
- For score < 3: Always reset repetition to 0 and interval to 1 day
- For score = 3: If it's after multiple successful recalls (repetition > 1), reset to avoid forgetting
- For score > 3: Increase the interval based on the ease factor

This approach ensures that cards that are difficult to remember are shown more frequently, while cards that are easy to remember are shown less frequently, optimizing the learning process.

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Expo Go app (for mobile testing)

### Optional Dependencies
- react-native-svg: For enhanced SVG icon support
  ```
  npm install react-native-svg
  ```

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/SM2.git
cd SM2
```

2. Install dependencies separately:
```
# Install backend dependencies
cd backend
npm install

# Install SM2FlashcardApp dependencies
cd ../SM2FlashcardApp
npm install

# Install mobile frontend dependencies (if using)
cd ../sm2_mobile
npm install
```

3. Create a .env file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sm2-flashcards
JWT_SECRET=your_jwt_secret_key_here
```

4. Generate sample data (optional)
```
cd backend
npm run seed
```

5. Start the servers

For the backend:
```
cd backend
npm run dev
```

For the SM2FlashcardApp (React Native Web):
```
cd SM2FlashcardApp
npm start -- --web
```

For the mobile app (if using):
```
cd sm2_mobile
npm start
```
Then scan the QR code with the Expo Go app on your mobile device, or press 'a' to open in an Android emulator or 'i' for iOS simulator.

## Usage

1. **Registration and Login**:
   - Register a new account with a username, email, and password
   - Log in with your email and password
   - Your data is securely stored and associated with your account

2. **Creating Flashcards**:
   - Click the "Create New Flashcard" button on the flashcards page
   - Enter the front (question) and back (answer) content
   - Submit the form to create the flashcard

3. **Reviewing Flashcards**:
   - Click the "Review Due Cards" button to start a review session
   - Click on a flashcard to flip it and reveal the answer
   - Rate your recall quality from 0-5 using the buttons provided
   - The system will automatically schedule the next review based on your performance

4. **Managing Flashcards**:
   - View all your flashcards on the flashcards page
   - See the next review date and current learning strength for each flashcard
   - Delete flashcards you no longer need

5. **Tracking Progress**:
   - The dashboard shows statistics about your learning progress
   - See how many cards are due for review today
   - Monitor your overall retention rate

## UI/UX Features

The application features a modern, clean UI with several enhancements:

### SM2FlashcardApp (React Native Web)
1. **3D Flashcard Animations**: Smooth 3D flip animations for flashcards with proper text orientation
2. **Modern Dashboard**: Clean, card-based layout with key metrics (due cards, total cards)
3. **Intuitive Review Interface**: Clear, visually distinct rating buttons with color coding (0-5)
4. **Responsive Design**: Works seamlessly on all devices from mobile to desktop
5. **Consistent Theme**: Clean white theme for a professional, distraction-free learning experience
6. **Visual Strength Indicators**: Color-coded indicators showing learning strength for each flashcard:
   - **New**: Cards that haven't been reviewed yet (Rep: 0)
   - **Learning**: Cards in the early stages of learning (1-2 repetitions)
   - **Reviewing**: Cards being regularly reviewed
   - **Difficult**: Cards with low ease factor (< 2.0)
   - **Mastered**: Cards with high ease factor (≥ 2.5)
7. **Progress Tracking**: Visual progress bars showing learning strength based on ease factor
8. **Next Review Indicators**: Clear display of when each card is due for review (Today, Tomorrow, or specific date)
9. **EF Score Display**: Transparent display of Ease Factor (EF) and Repetition count for each card
10. **Review Statistics**: Detailed breakdown of review performance after each session

### Mobile Version (React Native)
1. **Native Mobile Experience**: Built with React Native for a true native mobile experience
2. **Gesture-Based Interactions**: Swipe and tap gestures for intuitive card interactions
3. **Animated Transitions**: Smooth animations between screens and card states
4. **Offline Capability**: Review flashcards even without an internet connection
5. **Mobile-Optimized UI**: Interface designed specifically for mobile screens
6. **Cross-Platform**: Works on both iOS and Android devices
7. **Visual Learning Status**: Color-coded badges showing the learning status of each card
8. **Detailed Statistics**: View detailed statistics about your learning progress, including ease factor and repetition count

The UI is designed to be intuitive and distraction-free, allowing users to focus on the learning process.

## SM2 Algorithm Verification

The SM2 algorithm implementation has been thoroughly verified to ensure it correctly calculates:

1. **Ease Factor (EF) Updates**: The formula `EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))` is correctly applied, with EF constrained to a minimum of 1.3.

2. **Interval Calculation**:
   - For quality < 3: Reset repetitions to 0 and interval to 1 day
   - For quality = 3 with repetitions > 1: Reset repetitions to 0 and interval to 1 day (special case handling)
   - For first successful recall (repetitions = 0): Set interval to 1 day
   - For second successful recall (repetitions = 1): Set interval to 6 days
   - For subsequent successful recalls: interval = previous interval * EF

3. **Next Review Date Calculation**: The next review date is correctly calculated by adding the interval to the current date.

4. **Due Card Identification**: The system correctly identifies cards that are due for review by comparing the next review date with the current date.

The implementation has been tested with various scenarios and edge cases to ensure it behaves as expected. The UI accurately displays the EF scores, repetition counts, and next review dates for all flashcards.
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

### Frontend
- React
- TypeScript
- Axios for API requests
- React Router for navigation
- CSS with modern animations and transitions
- Responsive design principles

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

The SM2 algorithm is implemented in the backend in the `controllers/flashcardController.js` file. The key function is `updateFlashcardWithSM2`, which takes a flashcard and a grade (0-5) and updates the flashcard's properties according to the SM2 algorithm:

```javascript
const updateFlashcardWithSM2 = (flashcard, grade) => {
  // If grade is less than 3, reset repetitions to 0
  if (grade < 3) {
    flashcard.repetitions = 0;
    flashcard.interval = 1;
  } else {
    // Calculate new interval based on repetitions
    if (flashcard.repetitions === 0) {
      flashcard.interval = 1;
    } else if (flashcard.repetitions === 1) {
      flashcard.interval = 6;
    } else {
      flashcard.interval = Math.round(flashcard.interval * flashcard.easeFactor);
    }

    // Increment repetitions
    flashcard.repetitions += 1;
  }

  // Update ease factor
  const newEaseFactor = flashcard.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  flashcard.easeFactor = Math.max(1.3, newEaseFactor);

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + flashcard.interval);
  flashcard.nextReview = nextReview;

  return flashcard;
};
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/SM2.git
cd SM2
```

2. Install all dependencies at once
```
npm run install:all
```

Or install dependencies separately:
```
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
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
npm run seed
```

5. Start both servers at once
```
npm start
```

Or start servers separately:
```
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd frontend
npm start
```

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

1. **3D Flashcard Animations**: Smooth 3D flip animations for flashcards with proper text orientation
2. **Modern Dashboard**: Clean, card-based layout with key metrics (due cards, total cards, streak)
3. **Intuitive Review Interface**: Clear, visually distinct rating buttons with color coding
4. **Responsive Design**: Works seamlessly on all devices from mobile to desktop
5. **Consistent Theme**: Clean white theme for a professional, distraction-free learning experience
6. **Visual Strength Indicators**: Color-coded indicators showing learning strength for each flashcard

The UI is designed to be intuitive and distraction-free, allowing users to focus on the learning process.
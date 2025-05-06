# SM2 Flashcard App

A mobile flashcard application built with React Native that implements the SuperMemo 2 (SM2) spaced repetition algorithm to help users learn and retain information more effectively.

## Features

- User authentication (register, login, logout)
- Create, edit, and delete flashcards
- Organize flashcards by categories
- Review flashcards using the SM2 spaced repetition algorithm
- Track learning progress with statistics

## Technology Stack

- **Frontend**: React Native (without Expo)
- **State Management**: React Context API
- **Navigation**: React Navigation
- **Storage**: AsyncStorage for local data persistence
- **Backend**: Node.js and MongoDB (to be implemented)

## SM2 Algorithm

The SuperMemo 2 (SM2) algorithm is a spaced repetition algorithm that schedules flashcard reviews based on how well the user remembers them. The algorithm adjusts the intervals between reviews based on the user's performance, showing difficult cards more frequently and easy cards less often.

The implementation includes:
- Quality ratings (0-5) for user responses
- Ease factor calculation
- Interval calculation
- Next review date scheduling

## Project Structure

```
SM2FlashcardApp/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context for state management
│   ├── screens/          # Screen components
│   ├── services/         # API services
│   ├── utils/            # Utility functions (including SM2 algorithm)
│   └── types/            # Type definitions
├── App.tsx               # Main application component
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- React Native development environment
- Android Studio or Xcode (for running on emulators/simulators)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Run on Android:
   ```
   npm run android
   ```
5. Run on iOS:
   ```
   npm run ios
   ```

## Usage

1. Register a new account or log in with existing credentials
2. Create flashcards with questions and answers
3. Review flashcards when they are due
4. Rate your performance to optimize the review schedule

## Future Enhancements

- Backend integration with Node.js and MongoDB
- Offline mode with data synchronization
- Import/export flashcards
- Advanced statistics and learning analytics
- Multimedia support (images, audio)
- Collaborative features (shared decks)

## License

This project is licensed under the MIT License.

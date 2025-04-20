# SM2 Spaced Repetition System

A simple flashcard application that uses the SuperMemo 2 (SM2) algorithm for spaced repetition to help users memorize information efficiently.

## Features

- Create and manage flashcards
- Review flashcards using spaced repetition
- Track learning progress
- Automatically schedule reviews based on recall performance

## Technology Stack

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

### Frontend
- React
- TypeScript
- Axios
- React Router

## SM2 Algorithm

The application uses the SuperMemo 2 (SM2) algorithm for spaced repetition. The algorithm adjusts the interval between reviews based on how well the user recalls the information:

- If the user gets the answer right (grade ≥ 3), the interval increases
- If the user gets the answer wrong (grade < 3), the interval resets to 1 day
- The ease factor (EF) is adjusted based on the recall quality

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

1. Register a new account or log in
2. Create flashcards with front (question) and back (answer) content
3. Review flashcards and rate your recall quality from 0-5
4. The system will automatically schedule the next review based on your performance

## License

This project is licensed under the MIT License - see the LICENSE file for details.

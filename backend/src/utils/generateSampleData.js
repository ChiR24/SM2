const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Flashcard = require('../models/Flashcard');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Sample flashcards data (numbers 1-10 with their text representation)
const sampleFlashcards = [
  { front: '1', back: 'One' },
  { front: '2', back: 'Two' },
  { front: '3', back: 'Three' },
  { front: '4', back: 'Four' },
  { front: '5', back: 'Five' },
  { front: '6', back: 'Six' },
  { front: '7', back: 'Seven' },
  { front: '8', back: 'Eight' },
  { front: '9', back: 'Nine' },
  { front: '10', back: 'Ten' }
];

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sm2-flashcards';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing data
      await User.deleteMany({});
      await Flashcard.deleteMany({});
      
      console.log('Cleared existing data');
      
      // Create a test user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword
      });
      
      const savedUser = await user.save();
      console.log('Created test user:', savedUser.username);
      
      // Create sample flashcards for the user
      const flashcardPromises = sampleFlashcards.map(card => {
        const flashcard = new Flashcard({
          user: savedUser._id,
          front: card.front,
          back: card.back,
          // Default SM2 values are set in the model
        });
        
        return flashcard.save();
      });
      
      const savedFlashcards = await Promise.all(flashcardPromises);
      console.log(`Created ${savedFlashcards.length} sample flashcards`);
      
      console.log('Sample data generation complete!');
      process.exit(0);
    } catch (error) {
      console.error('Error generating sample data:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

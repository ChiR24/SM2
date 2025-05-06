import { Platform } from 'react-native';
import AsyncStorageWeb from '../utils/AsyncStorageWeb';

// Use AsyncStorage for React Native and localStorage for web
const AsyncStorage = AsyncStorageWeb;

// Default mock data for local development
const defaultUsers = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  },
];

const defaultFlashcards = [
  {
    id: '1',
    userId: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    category: 'Geography',
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: null,
  },
  {
    id: '2',
    userId: '1',
    question: 'What is 2 + 2?',
    answer: '4',
    category: 'Mathematics',
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: null,
  },
  {
    id: '3',
    userId: '1',
    question: 'Who wrote "Romeo and Juliet"?',
    answer: 'William Shakespeare',
    category: 'Literature',
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: null,
  },
];

// Initialize mock database in localStorage
const initMockDatabase = async () => {
  console.log('Initializing mock database');

  try {
    // Check if users exist in localStorage
    const storedUsers = await AsyncStorage.getItem('mock_users');
    if (!storedUsers) {
      // Initialize with default users
      await AsyncStorage.setItem('mock_users', JSON.stringify(defaultUsers));
      console.log('Initialized users in localStorage');
    }

    // Check if flashcards exist in localStorage
    const storedFlashcards = await AsyncStorage.getItem('mock_flashcards');
    if (!storedFlashcards) {
      // Initialize with default flashcards
      await AsyncStorage.setItem('mock_flashcards', JSON.stringify(defaultFlashcards));
      console.log('Initialized flashcards in localStorage');
    }
  } catch (error) {
    console.error('Error initializing mock database:', error);
  }
};

// Load users from localStorage
const loadUsers = async () => {
  try {
    const storedUsers = await AsyncStorage.getItem('mock_users');
    return storedUsers ? JSON.parse(storedUsers) : defaultUsers;
  } catch (error) {
    console.error('Error loading users:', error);
    return defaultUsers;
  }
};

// Save users to localStorage
const saveUsers = async (users) => {
  try {
    await AsyncStorage.setItem('mock_users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Load flashcards from localStorage
const loadFlashcards = async () => {
  try {
    const storedFlashcards = await AsyncStorage.getItem('mock_flashcards');
    return storedFlashcards ? JSON.parse(storedFlashcards) : defaultFlashcards;
  } catch (error) {
    console.error('Error loading flashcards:', error);
    return defaultFlashcards;
  }
};

// Save flashcards to localStorage
const saveFlashcards = async (flashcards) => {
  try {
    await AsyncStorage.setItem('mock_flashcards', JSON.stringify(flashcards));
  } catch (error) {
    console.error('Error saving flashcards:', error);
  }
};

// Initialize the mock database
initMockDatabase();

// In-memory cache of the database
let users = [];
let flashcards = [];

// Load the database into memory
(async () => {
  users = await loadUsers();
  flashcards = await loadFlashcards();
  console.log('Loaded mock database into memory:', {
    usersCount: users.length,
    flashcardsCount: flashcards.length
  });
})();

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Auth API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    await delay(500); // Simulate network delay

    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return Promise.reject({
        response: {
          data: {
            message: 'Email already in use',
          },
        },
      });
    }

    // Create new user
    const newUser = {
      id: generateId(),
      ...userData,
    };

    users.push(newUser);

    // Generate token (in a real app, this would be a JWT)
    const token = `mock-token-${newUser.id}`;

    return {
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      },
    };
  },

  // Login a user
  login: async (credentials) => {
    console.log('API: login called with', { email: credentials.email, passwordProvided: !!credentials.password });

    try {
      await delay(500); // Simulate network delay

      // Find user by email
      const user = users.find(user => user.email === credentials.email);
      console.log('API: User found?', !!user);

      // Check if user exists and password matches
      if (!user) {
        console.log('API: User not found');
        return Promise.reject({
          response: {
            data: {
              message: 'Invalid email or password',
            },
          },
        });
      }

      if (user.password !== credentials.password) {
        console.log('API: Password does not match');
        return Promise.reject({
          response: {
            data: {
              message: 'Invalid email or password',
            },
          },
        });
      }

      // Generate token (in a real app, this would be a JWT)
      const token = `mock-token-${user.id}`;
      console.log('API: Generated token', token);

      const responseData = {
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        },
      };

      console.log('API: Login successful, returning data', responseData);
      return responseData;
    } catch (error) {
      console.error('API: Error in login', error);
      return Promise.reject({
        response: {
          data: {
            message: `Login error: ${error.message || 'Unknown error'}`,
          },
        },
      });
    }
  },

  // Logout a user
  logout: async () => {
    await delay(300); // Simulate network delay
    return { data: { success: true } };
  },
};

// Flashcard API calls
export const flashcardAPI = {
  // Get all flashcards for the current user
  getAll: async () => {
    console.log('API: getAll called');

    try {
      await delay(500); // Simulate network delay

      // Get user ID from token
      const token = await AsyncStorage.getItem('token');
      const userId = token ? token.split('-')[2] : null;

      if (!userId) {
        return Promise.reject({
          response: {
            data: {
              message: 'Unauthorized',
            },
          },
        });
      }

      // Make sure we have the latest flashcards from localStorage
      flashcards = await loadFlashcards();
      console.log('API: Loaded flashcards from localStorage, count:', flashcards.length);

      // Filter flashcards by user ID
      const userFlashcards = flashcards.filter(card => card.userId === userId);
      console.log(`API: Found ${userFlashcards.length} flashcards for user ${userId}`);

      return { data: userFlashcards };
    } catch (error) {
      console.error('API: Error getting all flashcards', error);
      return Promise.reject({
        response: {
          data: {
            message: `Error getting flashcards: ${error.message || 'Unknown error'}`,
          },
        },
      });
    }
  },

  // Get a specific flashcard
  getById: async (id) => {
    await delay(300); // Simulate network delay

    // Get user ID from token
    const token = await AsyncStorage.getItem('token');
    const userId = token ? token.split('-')[2] : null;

    if (!userId) {
      return Promise.reject({
        response: {
          data: {
            message: 'Unauthorized',
          },
        },
      });
    }

    // Find flashcard by ID and ensure it belongs to the user
    const flashcard = flashcards.find(card => card.id === id && card.userId === userId);

    if (!flashcard) {
      return Promise.reject({
        response: {
          data: {
            message: 'Flashcard not found',
          },
        },
      });
    }

    return { data: flashcard };
  },

  // Create a new flashcard
  create: async (flashcardData) => {
    console.log('API: create flashcard called with', flashcardData);

    try {
      await delay(500); // Simulate network delay

      // Get user ID from token
      const token = await AsyncStorage.getItem('token');
      console.log('API: Token retrieved', token);

      const userId = token ? token.split('-')[2] : null;
      console.log('API: User ID extracted', userId);

      if (!userId) {
        console.error('API: No user ID found in token');
        return Promise.reject({
          response: {
            data: {
              message: 'Unauthorized - No valid user token found',
            },
          },
        });
      }

      // Create new flashcard
      const newFlashcard = {
        id: generateId(),
        userId,
        ...flashcardData,
        // Ensure dates are stored as strings
        nextReviewDate: flashcardData.nextReviewDate ?
          (typeof flashcardData.nextReviewDate === 'string' ?
            flashcardData.nextReviewDate :
            flashcardData.nextReviewDate.toISOString()) :
          new Date().toISOString(),
        lastReviewDate: flashcardData.lastReviewDate ?
          (typeof flashcardData.lastReviewDate === 'string' ?
            flashcardData.lastReviewDate :
            flashcardData.lastReviewDate.toISOString()) :
          null,
      };

      console.log('API: Created new flashcard object', newFlashcard);

      // Add to the in-memory database
      flashcards.push(newFlashcard);
      console.log('API: Added flashcard to in-memory database, current count:', flashcards.length);

      // Save to localStorage
      await saveFlashcards(flashcards);
      console.log('API: Saved flashcards to localStorage');

      // For debugging, show all flashcards for this user
      const userCards = flashcards.filter(card => card.userId === userId);
      console.log(`API: User now has ${userCards.length} flashcards`);

      return { data: newFlashcard };
    } catch (error) {
      console.error('API: Error in create flashcard', error);
      return Promise.reject({
        response: {
          data: {
            message: `Error creating flashcard: ${error.message || 'Unknown error'}`,
          },
        },
      });
    }
  },

  // Update a flashcard
  update: async (id, flashcardData) => {
    console.log('API: update flashcard called with', { id, flashcardData });

    try {
      await delay(500); // Simulate network delay

      // Get user ID from token
      const token = await AsyncStorage.getItem('token');
      const userId = token ? token.split('-')[2] : null;

      if (!userId) {
        return Promise.reject({
          response: {
            data: {
              message: 'Unauthorized',
            },
          },
        });
      }

      // Find flashcard index
      const index = flashcards.findIndex(card => card.id === id && card.userId === userId);

      if (index === -1) {
        return Promise.reject({
          response: {
            data: {
              message: 'Flashcard not found',
            },
          },
        });
      }

      // Update flashcard
      const updatedFlashcard = {
        ...flashcards[index],
        ...flashcardData,
        userId, // Ensure userId doesn't change
        // Ensure dates are stored as strings
        nextReviewDate: flashcardData.nextReviewDate ?
          (typeof flashcardData.nextReviewDate === 'string' ?
            flashcardData.nextReviewDate :
            flashcardData.nextReviewDate.toISOString()) :
          flashcards[index].nextReviewDate,
        lastReviewDate: flashcardData.lastReviewDate ?
          (typeof flashcardData.lastReviewDate === 'string' ?
            flashcardData.lastReviewDate :
            flashcardData.lastReviewDate.toISOString()) :
          flashcards[index].lastReviewDate,
      };

      // Update in-memory database
      flashcards[index] = updatedFlashcard;
      console.log('API: Updated flashcard in memory', updatedFlashcard);

      // Save to localStorage
      await saveFlashcards(flashcards);
      console.log('API: Saved flashcards to localStorage after update');

      return { data: updatedFlashcard };
    } catch (error) {
      console.error('API: Error updating flashcard', error);
      return Promise.reject({
        response: {
          data: {
            message: `Error updating flashcard: ${error.message || 'Unknown error'}`,
          },
        },
      });
    }
  },

  // Delete a flashcard
  delete: async (id) => {
    console.log('API: delete flashcard called with id', id);

    try {
      await delay(500); // Simulate network delay

      // Get user ID from token
      const token = await AsyncStorage.getItem('token');
      const userId = token ? token.split('-')[2] : null;

      if (!userId) {
        return Promise.reject({
          response: {
            data: {
              message: 'Unauthorized',
            },
          },
        });
      }

      // Find flashcard index
      const index = flashcards.findIndex(card => card.id === id && card.userId === userId);

      if (index === -1) {
        return Promise.reject({
          response: {
            data: {
              message: 'Flashcard not found',
            },
          },
        });
      }

      // Remove flashcard from in-memory database
      flashcards.splice(index, 1);
      console.log('API: Removed flashcard from memory, remaining count:', flashcards.length);

      // Save to localStorage
      await saveFlashcards(flashcards);
      console.log('API: Saved flashcards to localStorage after deletion');

      return { data: { success: true } };
    } catch (error) {
      console.error('API: Error deleting flashcard', error);
      return Promise.reject({
        response: {
          data: {
            message: `Error deleting flashcard: ${error.message || 'Unknown error'}`,
          },
        },
      });
    }
  },

  // Get flashcards due for review
  getDue: async () => {
    console.log('API: getDue called');

    try {
      await delay(500); // Simulate network delay

      // Get user ID from token
      const token = await AsyncStorage.getItem('token');
      const userId = token ? token.split('-')[2] : null;

      if (!userId) {
        return Promise.reject({
          response: {
            data: {
              message: 'Unauthorized',
            },
          },
        });
      }

      // Filter flashcards by user ID and due date
      const currentDate = new Date();
      console.log('API: Current date for due check:', currentDate.toISOString());

      // Make sure we have the latest flashcards from localStorage
      flashcards = await loadFlashcards();

      const dueFlashcards = flashcards.filter(card => {
        // Parse the nextReviewDate string to a Date object
        const nextReviewDate = new Date(card.nextReviewDate);
        const isDue = card.userId === userId && nextReviewDate <= currentDate;

        console.log('API: Checking card:', {
          id: card.id,
          userId: card.userId,
          nextReviewDate: card.nextReviewDate,
          parsedDate: nextReviewDate.toISOString(),
          isDue
        });

        return isDue;
      });

      console.log(`API: Found ${dueFlashcards.length} due flashcards`);
      return { data: dueFlashcards };
    } catch (error) {
      console.error('API: Error getting due flashcards', error);
      return Promise.reject({
        response: {
          data: {
            message: `Error getting due flashcards: ${error.message || 'Unknown error'}`,
          },
        },
      });
    }
  },

  // Update flashcard after review
  updateAfterReview: async (id, reviewData) => {
    console.log('API: updateAfterReview called with', { id, reviewData });

    try {
      await delay(500); // Simulate network delay

      // Get user ID from token
      const token = await AsyncStorage.getItem('token');
      const userId = token ? token.split('-')[2] : null;

      if (!userId) {
        return Promise.reject({
          response: {
            data: {
              message: 'Unauthorized',
            },
          },
        });
      }

      // Find flashcard index
      const index = flashcards.findIndex(card => card.id === id && card.userId === userId);

      if (index === -1) {
        return Promise.reject({
          response: {
            data: {
              message: 'Flashcard not found',
            },
          },
        });
      }

      // Ensure dates are stored as strings
      const processedReviewData = {
        ...reviewData,
        nextReviewDate: reviewData.nextReviewDate ?
          (typeof reviewData.nextReviewDate === 'string' ?
            reviewData.nextReviewDate :
            reviewData.nextReviewDate.toISOString()) :
          flashcards[index].nextReviewDate,
        lastReviewDate: reviewData.lastReviewDate ?
          (typeof reviewData.lastReviewDate === 'string' ?
            reviewData.lastReviewDate :
            reviewData.lastReviewDate.toISOString()) :
          flashcards[index].lastReviewDate,
      };

      // Update flashcard with review data
      const updatedFlashcard = {
        ...flashcards[index],
        ...processedReviewData,
      };

      // Update in-memory database
      flashcards[index] = updatedFlashcard;
      console.log('API: Updated flashcard after review in memory', updatedFlashcard);

      // Save to localStorage
      await saveFlashcards(flashcards);
      console.log('API: Saved flashcards to localStorage after review');

      return { data: updatedFlashcard };
    } catch (error) {
      console.error('API: Error updating flashcard after review', error);
      return Promise.reject({
        response: {
          data: {
            message: `Error updating flashcard after review: ${error.message || 'Unknown error'}`,
          },
        },
      });
    }
  },
};

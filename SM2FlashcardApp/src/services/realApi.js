import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorageWeb from '../utils/AsyncStorageWeb';
import { createLogger } from '../utils/logger';

const logger = createLogger('RealAPI');

// Use AsyncStorage for React Native and localStorage for web
const AsyncStorage = AsyncStorageWeb;

// API base URL - platform specific
// For Android emulator, 10.0.2.2 points to the host machine's localhost
// For iOS simulator, localhost points to the host machine
// For web, use localhost
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';
  } else {
    return 'http://localhost:5000/api';
  }
};

const API_URL = getApiUrl();

// Get the base server URL (without /api)
const getServerUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000';
  } else {
    return 'http://localhost:5000';
  }
};

// Function to check if the server is available
export const checkServerAvailability = async () => {
  try {
    const serverUrl = getServerUrl();
    logger.debug(`Checking server availability at ${serverUrl}`);
    const response = await axios.get(serverUrl, { timeout: 5000 });
    logger.info('Server is available');
    return true;
  } catch (error) {
    logger.error('Server is not available:', error.message);
    return false;
  }
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Set the JWT token in the x-auth-token header as expected by the backend
        config.headers['x-auth-token'] = token;
        logger.debug('Auth token added to request');
      } else {
        logger.debug('No token found in AsyncStorage');
      }
      return config;
    } catch (error) {
      logger.error('Error setting auth token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error('API error response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });
    } else if (error.request) {
      // The request was made but no response was received
      logger.error('API no response:', {
        request: error.request,
        url: error.config.url,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.error('API request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    logger.info('Registering new user', {
      username: userData.username,
      email: userData.email,
    });

    try {
      // Make sure the endpoint matches the backend route
      const response = await api.post('/users/register', userData);
      logger.debug('Registration successful');

      // Store the JWT token in AsyncStorage
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        logger.debug('JWT token stored in AsyncStorage');

        // Store user data in AsyncStorage
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          logger.debug('User data stored in AsyncStorage');
        }
      }

      return response;
    } catch (error) {
      // Handle specific error cases
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to the server. Please make sure the backend server is running.');
      } else if (error.response && error.response.status === 404) {
        throw new Error('Registration endpoint not found. Please check the API URL and make sure the backend server is running.');
      } else if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message || 'Registration failed. Please check your information.');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw error;
      }
    }
  },

  // Login a user
  login: async (credentials) => {
    logger.info('Logging in user', {
      email: credentials.email,
    });

    try {
      // Make sure the endpoint matches the backend route
      const response = await api.post('/users/login', credentials);
      logger.debug('Login successful');

      // Store the JWT token in AsyncStorage
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        logger.debug('JWT token stored in AsyncStorage');

        // Store user data in AsyncStorage
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          logger.debug('User data stored in AsyncStorage');
        }
      }

      return response;
    } catch (error) {
      // Handle specific error cases
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to the server. Please make sure the backend server is running.');
      } else if (error.response && error.response.status === 404) {
        throw new Error('Login endpoint not found. Please check the API URL and make sure the backend server is running.');
      } else if (error.response && error.response.status === 401) {
        throw new Error('Invalid credentials. Please check your email and password.');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw error;
      }
    }
  },

  // Logout a user (client-side only, no server endpoint needed)
  logout: async () => {
    logger.info('Logging out user');

    try {
      // Remove the JWT token from AsyncStorage
      await AsyncStorage.removeItem('token');
      logger.debug('JWT token removed from AsyncStorage');

      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      logger.debug('User data removed from AsyncStorage');

      return { data: { success: true } };
    } catch (error) {
      logger.error('Logout error', error);
      throw error;
    }
  },
};

// Flashcard API calls
export const flashcardAPI = {
  // Get all flashcards for the current user
  getAll: async () => {
    console.log('RealAPI: getAll called');

    try {
      const response = await api.get('/flashcards');
      console.log('RealAPI: getAll response', response.data);

      // Transform the data to match the expected format in the app
      const transformedData = response.data.map(card => ({
        id: card._id,
        userId: card.user,
        question: card.front, // Map front to question
        answer: card.back,    // Map back to answer
        category: card.category || 'General',  // Use the category from the response or default
        easeFactor: card.efactor,
        interval: card.interval,
        repetitions: card.repetition,
        nextReviewDate: card.nextReviewDate,
        lastReviewDate: card.lastReviewDate,
      }));

      return { data: transformedData };
    } catch (error) {
      console.error('RealAPI: getAll error', error.response?.data || error.message);
      throw error;
    }
  },

  // Get flashcards due for review
  getDue: async () => {
    console.log('RealAPI: getDue called');

    try {
      const response = await api.get('/flashcards/due');
      console.log('RealAPI: getDue response', response.data);

      // Transform the data to match the expected format in the app
      const transformedData = response.data.map(card => ({
        id: card._id,
        userId: card.user,
        question: card.front, // Map front to question
        answer: card.back,    // Map back to answer
        category: card.category || 'General',  // Use the category from the response or default
        easeFactor: card.efactor,
        interval: card.interval,
        repetitions: card.repetition,
        nextReviewDate: card.nextReviewDate,
        lastReviewDate: card.lastReviewDate,
      }));

      return { data: transformedData };
    } catch (error) {
      console.error('RealAPI: getDue error', error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new flashcard
  create: async (flashcardData) => {
    console.log('RealAPI: create called with', flashcardData);

    try {
      // Transform the data to match the backend schema
      const transformedData = {
        front: flashcardData.question, // Map question to front
        back: flashcardData.answer,    // Map answer to back
        category: flashcardData.category || 'General', // Include category
      };

      const response = await api.post('/flashcards', transformedData);
      console.log('RealAPI: create response', response.data);

      // Transform the response back to match the expected format in the app
      const transformedResponse = {
        id: response.data._id,
        userId: response.data.user,
        question: response.data.front,
        answer: response.data.back,
        category: response.data.category || 'General', // Use the category from the response or default
        easeFactor: response.data.efactor,
        interval: response.data.interval,
        repetitions: response.data.repetition,
        nextReviewDate: response.data.nextReviewDate,
        lastReviewDate: response.data.lastReviewDate,
      };

      return { data: transformedResponse };
    } catch (error) {
      console.error('RealAPI: create error', error.response?.data || error.message);
      throw error;
    }
  },

  // Update a flashcard
  update: async (id, flashcardData) => {
    console.log('RealAPI: update called with', { id, flashcardData });

    try {
      // Transform the data to match the backend schema
      const transformedData = {};

      if (flashcardData.question) {
        transformedData.front = flashcardData.question;
      }

      if (flashcardData.answer) {
        transformedData.back = flashcardData.answer;
      }

      if (flashcardData.category) {
        transformedData.category = flashcardData.category;
      }

      const response = await api.put(`/flashcards/${id}`, transformedData);
      console.log('RealAPI: update response', response.data);

      // Transform the response back to match the expected format in the app
      const transformedResponse = {
        id: response.data._id,
        userId: response.data.user,
        question: response.data.front,
        answer: response.data.back,
        category: response.data.category || 'General', // Use the category from the response or default
        easeFactor: response.data.efactor,
        interval: response.data.interval,
        repetitions: response.data.repetition,
        nextReviewDate: response.data.nextReviewDate,
        lastReviewDate: response.data.lastReviewDate,
      };

      return { data: transformedResponse };
    } catch (error) {
      console.error('RealAPI: update error', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a flashcard
  delete: async (id) => {
    console.log('RealAPI: delete called with id', id);

    try {
      // Make sure the ID is valid
      if (!id) {
        console.error('RealAPI: Invalid ID provided for deletion');
        throw new Error('Invalid ID provided for deletion');
      }

      // Log the full URL for debugging
      const url = `/flashcards/${id}`;
      console.log('RealAPI: Sending DELETE request to', API_URL + url);

      // Add a timeout to the request
      const response = await api.delete(url, { timeout: 10000 });
      console.log('RealAPI: delete response', response.data);

      // Check if the response is valid
      if (!response || !response.data) {
        console.error('RealAPI: Invalid response from server');
        throw new Error('Invalid response from server');
      }

      // Return a standardized response
      return {
        data: {
          success: true,
          message: 'Flashcard deleted successfully',
          id: id
        }
      };
    } catch (error) {
      console.error('RealAPI: delete error', error.response?.data || error.message);

      // Handle specific error cases
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to the server. Please make sure the backend server is running.');
      } else if (error.response && error.response.status === 404) {
        throw new Error('Flashcard not found or already deleted.');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw error;
      }
    }
  },

  // Review a flashcard
  updateAfterReview: async (id, reviewData) => {
    console.log('RealAPI: updateAfterReview called with', { id, reviewData });

    try {
      // Transform the quality score to match the backend API
      // The backend expects a grade from 0-5
      const grade = reviewData.quality;

      const response = await api.post(`/flashcards/${id}/review`, { grade });
      console.log('RealAPI: updateAfterReview response', response.data);

      // Transform the response back to match the expected format in the app
      const transformedResponse = {
        id: response.data._id,
        userId: response.data.user,
        question: response.data.front,
        answer: response.data.back,
        category: response.data.category || 'General', // Use the category from the response or default
        easeFactor: response.data.efactor,
        interval: response.data.interval,
        repetitions: response.data.repetition,
        nextReviewDate: response.data.nextReviewDate,
        lastReviewDate: response.data.lastReviewDate,
      };

      return { data: transformedResponse };
    } catch (error) {
      console.error('RealAPI: updateAfterReview error', error.response?.data || error.message);
      throw error;
    }
  },
};

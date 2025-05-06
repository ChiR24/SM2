import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
// Import the real API instead of the mock API
import { flashcardAPI } from '../services/realApi';
import { getDueFlashcards, calculateNextInterval, calculateNextReviewDate } from '../utils/sm2';
import { useAuth } from './AuthContext';
import { createLogger } from '../utils/logger';

const logger = createLogger('FlashcardContext');

// Create the context
const FlashcardContext = createContext();

// Custom hook to use the flashcard context
export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};

// Flashcard provider component
export const FlashcardProvider = ({ children }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [dueFlashcards, setDueFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  // Fetch all flashcards when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFlashcards();
    } else {
      // Clear flashcards when not authenticated
      setFlashcards([]);
      setDueFlashcards([]);
    }
  }, [isAuthenticated]);

  // Update due flashcards whenever flashcards change
  useEffect(() => {
    const due = getDueFlashcards(flashcards);
    setDueFlashcards(due);
  }, [flashcards]);

  // Fetch all flashcards from the API - memoized to prevent unnecessary re-renders
  const fetchFlashcards = useCallback(async () => {
    logger.info('Fetching all flashcards');
    setLoading(true);
    setError(null);

    try {
      logger.debug('Calling flashcardAPI.getAll');
      const response = await flashcardAPI.getAll();

      if (response && response.data) {
        logger.info(`Received ${response.data.length} flashcards`);
        setFlashcards(response.data);
      } else {
        logger.error('Invalid response from API', response);
        setError('Invalid response from API');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch flashcards';
      logger.error('Error fetching flashcards:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new flashcard - memoized to prevent unnecessary re-renders
  const createFlashcard = useCallback(async (flashcardData) => {
    logger.info('Creating new flashcard');
    logger.debug('Flashcard data:', flashcardData);

    setLoading(true);
    setError(null);

    try {
      // Set initial SM2 values
      const currentDate = new Date();
      const newFlashcard = {
        ...flashcardData,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: currentDate, // Set to current date for immediate review
        lastReviewDate: null,
      };

      logger.debug('Calling flashcardAPI.create');
      const response = await flashcardAPI.create(newFlashcard);

      if (!response || !response.data) {
        throw new Error('Invalid response from API');
      }

      logger.info('Flashcard created successfully');

      // Add the new flashcard to the state
      setFlashcards(prevFlashcards => [...prevFlashcards, response.data]);

      return { success: true, flashcard: response.data };
    } catch (err) {
      logger.error('Error creating flashcard:', err);

      // Get a more detailed error message
      let errorMessage = 'Failed to create flashcard';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing flashcard - memoized to prevent unnecessary re-renders
  const updateFlashcard = useCallback(async (id, flashcardData) => {
    logger.info(`Updating flashcard with ID: ${id}`);
    logger.debug('Update data:', flashcardData);

    setLoading(true);
    setError(null);

    try {
      logger.debug('Calling flashcardAPI.update');
      const response = await flashcardAPI.update(id, flashcardData);

      if (!response || !response.data) {
        throw new Error('Invalid response from API');
      }

      logger.info('Flashcard updated successfully');

      // Update the flashcard in the state
      setFlashcards(prevFlashcards =>
        prevFlashcards.map(card =>
          card.id === id ? response.data : card
        )
      );

      return { success: true, flashcard: response.data };
    } catch (err) {
      logger.error('Error updating flashcard:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update flashcard';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a flashcard - memoized to prevent unnecessary re-renders
  const deleteFlashcard = useCallback(async (id) => {
    logger.info(`Deleting flashcard with ID: ${id}`);

    if (!id) {
      logger.error('Invalid ID provided for deletion');
      return { success: false, error: 'Invalid ID provided' };
    }

    setLoading(true);
    setError(null);

    try {
      // Remove the flashcard from the state immediately (optimistic update)
      setFlashcards(prevFlashcards => {
        logger.debug('Removing flashcard from state', id);
        return prevFlashcards.filter(card => card.id !== id);
      });

      logger.debug('Calling flashcardAPI.delete');
      const response = await flashcardAPI.delete(id);

      if (!response || !response.data || !response.data.success) {
        throw new Error('Invalid response from API');
      }

      logger.info('Flashcard deleted successfully');
      return { success: true };
    } catch (err) {
      logger.error('Error deleting flashcard:', err);

      // Get a more detailed error message
      let errorMessage = 'Failed to delete flashcard';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Restore the flashcards by fetching them again
      fetchFlashcards();

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchFlashcards]);

  // Review a flashcard and update its SM2 parameters - memoized to prevent unnecessary re-renders
  const reviewFlashcard = useCallback(async (id, quality) => {
    logger.info(`Reviewing flashcard with ID: ${id}, quality: ${quality}`);

    setLoading(true);
    setError(null);

    try {
      // Find the flashcard
      const flashcard = flashcards.find(card => card.id === id);

      if (!flashcard) {
        logger.error('Flashcard not found');
        throw new Error('Flashcard not found');
      }

      // Calculate new SM2 values
      const currentDate = new Date();
      const { repetitions, easeFactor, interval } = calculateNextInterval(
        quality,
        flashcard.repetitions,
        flashcard.easeFactor,
        flashcard.interval
      );

      const nextReviewDate = calculateNextReviewDate(currentDate, interval);

      logger.debug('Calculated new SM2 values', { repetitions, easeFactor, interval, nextReviewDate });

      // Update the flashcard with new SM2 values
      const updatedFlashcard = {
        ...flashcard,
        repetitions,
        easeFactor,
        interval,
        nextReviewDate,
        lastReviewDate: currentDate,
      };

      // Send the update to the API
      logger.debug('Calling flashcardAPI.updateAfterReview');
      const response = await flashcardAPI.updateAfterReview(id, {
        quality,
        repetitions,
        easeFactor,
        interval,
        nextReviewDate,
        lastReviewDate: currentDate,
      });

      logger.info('Flashcard reviewed successfully');

      // Update the flashcard in the state
      setFlashcards(prevFlashcards =>
        prevFlashcards.map(card =>
          card.id === id ? response.data : card
        )
      );

      return { success: true, flashcard: response.data };
    } catch (err) {
      logger.error('Error reviewing flashcard:', err);
      const errorMessage = err.response?.data?.message || 'Failed to review flashcard';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [flashcards]);

  // Value to be provided by the context - memoized to prevent unnecessary re-renders
  const value = useMemo(() => ({
    flashcards,
    dueFlashcards,
    loading,
    error,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
  }), [
    flashcards,
    dueFlashcards,
    loading,
    error,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
  ]);

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
};

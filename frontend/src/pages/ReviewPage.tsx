import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flashcardAPI } from '../services/api';
import { Flashcard, RecallGrade } from '../types';
import FlashcardItem from '../components/FlashcardItem';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewPage: React.FC = () => {
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewCompleted, setReviewCompleted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDueFlashcards = async () => {
      try {
        setLoading(true);
        const response = await flashcardAPI.getDueFlashcards();
        setDueFlashcards(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch flashcards due for review');
        setLoading(false);
      }
    };

    fetchDueFlashcards();
  }, []);

  const handleGrade = async (id: string, grade: RecallGrade) => {
    try {
      await flashcardAPI.reviewFlashcard(id, grade);

      // Move to the next card or complete the review
      if (currentIndex < dueFlashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setReviewCompleted(true);
      }
    } catch (err) {
      setError('Failed to submit review grade');
    }
  };

  const handleRestartReview = () => {
    setCurrentIndex(0);
    setReviewCompleted(false);
  };

  if (loading) {
    return <div className="loading">Loading flashcards...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (dueFlashcards.length === 0) {
    return (
      <motion.div
        className="review-container empty-state"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="empty-icon"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="#10b981"/>
          </svg>
        </motion.div>
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="empty-title"
        >
          All caught up!
        </motion.h2>
        <motion.p
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="empty-message"
        >
          You've completed all your flashcards due for review. Check back later for more.
        </motion.p>
        <motion.button
          className="btn-primary"
          onClick={() => navigate('/flashcards')}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Flashcards
        </motion.button>
      </motion.div>
    );
  }

  if (reviewCompleted) {
    return (
      <motion.div
        className="review-container completion-state"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="completion-icon"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#0ea5e9"/>
          </svg>
        </motion.div>
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="completion-title"
        >
          Session Complete!
        </motion.h2>
        <motion.p
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="completion-message"
        >
          You've successfully reviewed all {dueFlashcards.length} flashcards. Great job!
        </motion.p>
        <motion.div
          className="review-actions"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            className="btn-primary"
            onClick={handleRestartReview}
            whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            Review Again
          </motion.button>
          <motion.button
            className="btn-secondary"
            onClick={() => navigate('/flashcards')}
            whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Flashcards
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="review-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="review-header">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="review-title"
        >
          Review Flashcards
        </motion.h2>

        <motion.div
          className="review-progress"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="progress-info">
            <span className="progress-text">Card {currentIndex + 1} of {dueFlashcards.length}</span>
            <span className="progress-percentage">{Math.round(((currentIndex + 1) / dueFlashcards.length) * 100)}% Complete</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / dueFlashcards.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flashcard-review-wrapper"
        >
          <FlashcardItem
            flashcard={dueFlashcards[currentIndex]}
            onGrade={handleGrade}
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="review-stats"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="stat-item">
          <span className="stat-value">{dueFlashcards.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{currentIndex}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{dueFlashcards.length - currentIndex}</span>
          <span className="stat-label">Remaining</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewPage;

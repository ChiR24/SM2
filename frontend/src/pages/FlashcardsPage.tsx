import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flashcardAPI } from '../services/api';
import { Flashcard } from '../types';
import FlashcardForm from '../components/FlashcardForm';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardsPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const [flashcardsResponse, dueFlashcardsResponse] = await Promise.all([
          flashcardAPI.getFlashcards(),
          flashcardAPI.getDueFlashcards()
        ]);

        setFlashcards(flashcardsResponse.data);
        setDueCount(dueFlashcardsResponse.data.length);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch flashcards');
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleCreateFlashcard = async (flashcardData: { front: string; back: string }) => {
    try {
      const response = await flashcardAPI.createFlashcard(flashcardData);
      setFlashcards([response.data, ...flashcards]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create flashcard');
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    console.log('Delete button clicked for ID:', id);
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        console.log('Confirmed deletion for ID:', id);
        const response = await flashcardAPI.deleteFlashcard(id);
        console.log('Delete response:', response);

        // Refresh the flashcards list after deletion
        console.log('Refreshing flashcards list...');
        const flashcardsResponse = await flashcardAPI.getFlashcards();
        console.log('Got new flashcards:', flashcardsResponse.data.length);
        setFlashcards(flashcardsResponse.data);
        console.log('State updated with new flashcards');

        // Force a re-render
        setTimeout(() => {
          console.log('Checking flashcards count after timeout:',
            document.querySelectorAll('.flashcard-list-item').length);
        }, 500);
      } catch (err) {
        console.error('Error deleting flashcard:', err);
        setError('Failed to delete flashcard');
      }
    } else {
      console.log('Deletion cancelled by user');
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading flashcards...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Interface for review status
  interface ReviewStatus {
    label: string;
    color: string;
    bgColor: string;
  }

  // Calculate days until next review
  const getDaysUntilReview = (nextReviewDate: string) => {
    const today = new Date();
    const reviewDate = new Date(nextReviewDate);
    const diffTime = reviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status label and color based on days until review
  const getReviewStatus = (nextReviewDate: string): ReviewStatus => {
    const daysUntil = getDaysUntilReview(nextReviewDate);

    if (daysUntil <= 0) {
      return { label: 'Due Now', color: '#ef4444', bgColor: '#fee2e2' };
    } else if (daysUntil === 1) {
      return { label: 'Due Tomorrow', color: '#f97316', bgColor: '#ffedd5' };
    } else if (daysUntil <= 3) {
      return { label: `Due in ${daysUntil} days`, color: '#f59e0b', bgColor: '#fef3c7' };
    } else {
      return { label: `Due in ${daysUntil} days`, color: '#10b981', bgColor: '#d1fae5' };
    }
  };

  return (
    <motion.div
      className="flashcards-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flashcards-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="header-content">
          <h2>My Flashcards</h2>
          <div className="stats-summary">
            <div className="stat">
              <span className="stat-number">{flashcards.length}</span>
              <span className="stat-label">Total Cards</span>
            </div>
            <div className="stat">
              <span className="stat-number">{dueCount}</span>
              <span className="stat-label">Due Today</span>
            </div>
          </div>
        </div>
        <div className="flashcards-actions">
          <motion.button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? 'Cancel' : 'Create New Flashcard'}
          </motion.button>
          <motion.button
            className={`btn-secondary ${dueCount === 0 ? 'disabled' : ''}`}
            onClick={() => navigate('/review')}
            disabled={dueCount === 0}
            whileHover={dueCount > 0 ? { scale: 1.05 } : {}}
            whileTap={dueCount > 0 ? { scale: 0.95 } : {}}
          >
            Review Due Cards ({dueCount})
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FlashcardForm onSubmit={handleCreateFlashcard} />
          </motion.div>
        )}
      </AnimatePresence>

      {flashcards.length === 0 ? (
        <motion.div
          className="no-flashcards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#718096"/>
              <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#718096"/>
            </svg>
          </div>
          <h3>No flashcards yet</h3>
          <p>Create your first flashcard to start learning!</p>
          <motion.button
            className="btn-primary"
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create First Flashcard
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="flashcards-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {flashcards.map((flashcard, index) => {
            const statusInfo = getReviewStatus(flashcard.nextReviewDate);
            const statusLabel = statusInfo.label;

            return (
              <motion.div
                key={flashcard._id}
                className="flashcard-grid-item"
                data-id={flashcard._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              >
                <div className="card-header">
                  <div className="card-status" style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}>
                    {statusLabel}
                  </div>
                  <motion.button
                    className="delete-btn"
                    onClick={() => handleDeleteFlashcard(flashcard._id)}
                    whileHover={{ scale: 1.1, backgroundColor: '#fee2e2', color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                    </svg>
                  </motion.button>
                </div>
                <div className="card-content">
                  <div className="card-front">
                    <h3>{flashcard.front}</h3>
                  </div>
                  <div className="card-divider"></div>
                  <div className="card-back">
                    <p>{flashcard.back}</p>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="card-meta">
                    <div className="meta-item">
                      <span className="meta-label">Next:</span>
                      <span className="meta-value">{formatDate(flashcard.nextReviewDate)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Interval:</span>
                      <span className="meta-value">{flashcard.interval}d</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">EF:</span>
                      <span className="meta-value">{flashcard.efactor.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlashcardsPage;

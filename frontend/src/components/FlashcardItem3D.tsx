import React, { useState } from 'react';
import { Flashcard, FlashcardUI } from '../types';

interface FlashcardItem3DProps {
  flashcard: FlashcardUI | Flashcard;
  onDelete?: (id: string) => void;
}

const FlashcardItem3D: React.FC<FlashcardItem3DProps> = ({ flashcard, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Helper function to determine if flashcard is FlashcardUI or Flashcard
  const isFlashcardUI = (card: FlashcardUI | Flashcard): card is FlashcardUI => {
    return 'id' in card && 'easeFactor' in card && 'nextReview' in card;
  };

  // Get the appropriate properties based on flashcard type
  const getId = () => isFlashcardUI(flashcard) ? flashcard.id : flashcard._id;
  const getEaseFactor = () => isFlashcardUI(flashcard) ? flashcard.easeFactor : flashcard.efactor;
  const getNextReview = () => {
    if (isFlashcardUI(flashcard)) {
      return flashcard.nextReview;
    } else {
      return new Date(flashcard.nextReviewDate);
    }
  };

  // Calculate learning strength as a percentage (0-100)
  const calculateStrength = (easeFactor: number, repetitions: number) => {
    // Base strength on ease factor (ranges from 1.3 to 2.5+) and repetitions
    const easeFactorNormalized = Math.min(Math.max((easeFactor - 1.3) / 1.2, 0), 1);
    const repetitionsNormalized = Math.min(repetitions / 8, 1);

    // Weighted combination
    return Math.round((easeFactorNormalized * 0.7 + repetitionsNormalized * 0.3) * 100);
  };

  const strength = calculateStrength(getEaseFactor(), flashcard.repetitions);

  // Get color based on strength
  const getStrengthColor = (strength: number) => {
    if (strength < 30) return 'var(--color-error)';
    if (strength < 60) return 'var(--color-warning)';
    if (strength < 85) return 'var(--color-accent)';
    return 'var(--color-success)';
  };

  // Format next review date
  const formatNextReview = (date: Date) => {
    const now = new Date();
    const nextReview = new Date(date);

    // If date is today
    if (nextReview.toDateString() === now.toDateString()) {
      return 'Today';
    }

    // If date is tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (nextReview.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    // If within 7 days
    const daysDiff = Math.round((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return `In ${daysDiff} days`;
    }

    // Otherwise, return formatted date
    return nextReview.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Handle delete with the correct ID
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(getId());
    }
  };

  return (
    <div
      className="flashcard-item-3d"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flashcard-wrapper ${isFlipped ? 'is-flipped' : ''}`}>
        <div
          className="flashcard-inner"
          onClick={handleFlip}
          style={{
            transform: isHovered && !isFlipped ? 'rotateY(10deg)' : isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          }}
        >
          {/* Front of card */}
          <div className="flashcard-front">
            <div className="card-header">
              <div
                className="card-status"
                style={{
                  backgroundColor: `${getStrengthColor(strength)}20`,
                  color: getStrengthColor(strength)
                }}
              >
                {strength}% Strength
              </div>
              {onDelete && (
                <button
                  className="delete-btn"
                  onClick={handleDelete}
                  aria-label="Delete flashcard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              )}
            </div>
            <div className="card-content">
              <div className="card-front-content">
                <h3>{flashcard.front}</h3>
              </div>
              <div className="card-hint">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 15l-6-6"></path>
                  <path d="M9 15l6-6"></path>
                </svg>
                <span>Click to flip</span>
              </div>
            </div>
            <div className="flashcard-pattern"></div>
          </div>

          {/* Back of card */}
          <div className="flashcard-back">
            <div className="card-header">
              <div
                className="card-status"
                style={{
                  backgroundColor: `${getStrengthColor(strength)}20`,
                  color: getStrengthColor(strength)
                }}
              >
                {strength}% Strength
              </div>
              {onDelete && (
                <button
                  className="delete-btn"
                  onClick={handleDelete}
                  aria-label="Delete flashcard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              )}
            </div>
            <div className="card-content">
              <div className="card-back-content">
                <p>{flashcard.back}</p>
              </div>
              <div className="card-hint">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 15l-6-6"></path>
                  <path d="M9 15l6-6"></path>
                </svg>
                <span>Click to flip back</span>
              </div>
            </div>
            <div className="flashcard-pattern"></div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-label">Next Review</span>
            <span className="meta-value">{formatNextReview(getNextReview())}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Repetitions</span>
            <span className="meta-value">{flashcard.repetitions}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Ease</span>
            <span className="meta-value">{getEaseFactor().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem3D;

import React, { useState, useEffect } from 'react';
import { Flashcard, FlashcardUI, RecallGrade } from '../types';
import './FlashcardReview3D.css';

interface FlashcardReview3DProps {
  flashcard: FlashcardUI | Flashcard;
  onGrade: (grade: RecallGrade) => void;
}

const FlashcardReview3D: React.FC<FlashcardReview3DProps> = ({ flashcard, onGrade }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [animation, setAnimation] = useState('');

  // Reset state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setIsGrading(false);
    setSelectedGrade(null);
    setAnimation('animate-slide-in');

    // Remove animation class after animation completes
    const timer = setTimeout(() => {
      setAnimation('');
    }, 500);

    return () => clearTimeout(timer);
  }, [flashcard]);

  const handleFlip = () => {
    if (!isFlipped) {
      setAnimation('animate-flip');
      setIsFlipped(true);
      setIsGrading(true);
    }
  };

  const handleGrade = (grade: number) => {
    setSelectedGrade(grade);

    // Add a small delay before submitting the grade
    setTimeout(() => {
      setAnimation('animate-slide-out');

      // Wait for animation to complete before calling onGrade
      setTimeout(() => {
        // Convert to RecallGrade type
        onGrade(grade as RecallGrade);
      }, 300);
    }, 300);
  };

  // Grade descriptions
  const gradeDescriptions = [
    'Complete blackout',
    'Incorrect, but familiar',
    'Incorrect, but close',
    'Correct, with effort',
    'Correct, with hesitation',
    'Perfect recall'
  ];

  return (
    <div className="flashcard-review-3d-container">
      <div className={`flashcard-review-3d ${animation} ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="flashcard-review-inner" onClick={!isFlipped ? handleFlip : undefined}>
          {/* Front of card */}
          <div className="flashcard-review-front">
            <div className="review-content">
              <h3>{flashcard.front}</h3>
              {!isFlipped && (
                <div className="review-hint">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10l5 5 5-5"></path>
                  </svg>
                  <span>Click to reveal answer</span>
                </div>
              )}
            </div>
            <div className="review-pattern"></div>
          </div>

          {/* Back of card */}
          <div className="flashcard-review-back">
            <div className="review-content">
              <h3>{flashcard.back}</h3>
            </div>
            <div className="review-pattern"></div>
          </div>
        </div>
      </div>

      {isGrading && (
        <div className="grade-container animate-fade-in">
          <div className="grade-header">
            <h3 className="grade-title">How well did you know this?</h3>
            <p className="grade-subtitle">Rate your recall quality from 0-5</p>
          </div>

          <div className="grade-options">
            {[0, 1, 2, 3, 4, 5].map((grade) => (
              <button
                key={grade}
                className={`grade-btn grade-${grade} ${selectedGrade === grade ? 'selected' : ''}`}
                onClick={() => handleGrade(grade)}
                disabled={selectedGrade !== null}
              >
                <span className="grade-number">{grade}</span>
                <span className="grade-text">{gradeDescriptions[grade]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardReview3D;

import React, { useState } from 'react';
import { Flashcard, RecallGrade } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardItemProps {
  flashcard: Flashcard;
  onGrade: (id: string, grade: RecallGrade) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ flashcard, onGrade }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleFlip = () => {
    if (!isGrading) {
      setShowAnswer(!showAnswer);
    }
  };

  const handleGrade = (grade: RecallGrade) => {
    setIsGrading(true);
    // Add a small delay before submitting the grade to allow for animation
    setTimeout(() => {
      onGrade(flashcard._id, grade);
      setShowAnswer(false);
      setIsGrading(false);
    }, 300);
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate strength percentage based on efactor and interval
  const calculateStrength = () => {
    // Normalize efactor between 1.3 and 2.5
    const normalizedEF = ((flashcard.efactor - 1.3) / 1.2) * 100;
    // Combine with interval (capped at 30 days for visual purposes)
    const normalizedInterval = Math.min(flashcard.interval, 30) / 30 * 100;
    // Weighted average (efactor has more weight)
    return Math.round((normalizedEF * 0.7) + (normalizedInterval * 0.3));
  };

  const strength = calculateStrength();

  return (
    <div className="flashcard-container">
      <div className="flashcard-strength">
        <div className="strength-label">Recall Strength</div>
        <div className="strength-bar-container">
          <motion.div
            className="strength-bar"
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ backgroundColor: getStrengthColor(strength) }}
          />
        </div>
      </div>

      <div className="perspective-container">
        <motion.div
          className="flashcard-3d-space"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <motion.div
            className="flashcard-3d"
            animate={{
              rotateY: showAnswer ? 180 : 0,
              z: isHovering ? 20 : 0,
              boxShadow: isHovering
                ? '0 20px 30px rgba(0, 0, 0, 0.15)'
                : '0 10px 20px rgba(0, 0, 0, 0.1)',
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.8,
            }}
            onClick={handleFlip}
          >
            <div className="flashcard-front">
              <div className="flashcard-content">
                <h3>{flashcard.front}</h3>
                <motion.div
                  className="flashcard-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L16 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Tap to flip</span>
                </motion.div>
              </div>
              <div className="flashcard-pattern"></div>
            </div>
            <div className="flashcard-back">
              <div className="flashcard-content">
                <h3>{flashcard.back}</h3>
                <div className="flashcard-hint">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8L8 12L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Tap to flip back</span>
                </div>
              </div>
              <div className="flashcard-pattern"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAnswer && (
          <motion.div
            className="grade-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grade-header">
              <motion.div
                className="grade-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                How well did you remember this?
              </motion.div>
              <motion.div
                className="grade-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Rate your recall to optimize your learning
              </motion.div>
            </div>

            <div className="grade-options">
              {[0, 1, 2, 3, 4, 5].map((grade, index) => (
                <motion.button
                  key={grade}
                  className={`grade-btn grade-${grade}`}
                  onClick={() => handleGrade(grade as RecallGrade)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="grade-number">{grade}</span>
                  <span className="grade-text">{getGradeText(grade)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flashcard-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="info-item">
          <span className="info-label">Next review</span>
          <span className="info-value">{formatDate(flashcard.nextReviewDate)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Interval</span>
          <span className="info-value">{flashcard.interval} days</span>
        </div>
        <div className="info-item">
          <span className="info-label">Ease Factor</span>
          <span className="info-value">{flashcard.efactor.toFixed(2)}</span>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to get text description for each grade
function getGradeText(grade: number): string {
  switch(grade) {
    case 0: return "Complete Blackout";
    case 1: return "Incorrect, Remembered";
    case 2: return "Incorrect, Familiar";
    case 3: return "Correct, Difficult";
    case 4: return "Correct, Hesitation";
    case 5: return "Perfect Recall";
    default: return "";
  }
}

// Helper function to get color based on strength percentage
function getStrengthColor(strength: number): string {
  if (strength < 30) return "#f87171"; // Red
  if (strength < 60) return "#fbbf24"; // Orange
  if (strength < 80) return "#a3e635"; // Yellow-Green
  return "#34d399"; // Green
}

export default FlashcardItem;

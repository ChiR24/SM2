import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlashcardFormProps {
  onSubmit: (flashcardData: { front: string; back: string }) => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ onSubmit }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!front.trim() || !back.trim()) {
      alert('Please fill in both front and back fields');
      return;
    }

    onSubmit({ front, back });

    // Clear form
    setFront('');
    setBack('');
  };

  return (
    <div className="flashcard-form-container">
      <h2>Create New Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="front">Front (Question)</label>
          <motion.textarea
            id="front"
            value={front}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFront(e.target.value)}
            placeholder="Enter the question or prompt"
            required
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="form-textarea"
          />
          <div className="form-hint">This is what you'll need to recall</div>
        </div>

        <div className="form-group">
          <label htmlFor="back">Back (Answer)</label>
          <motion.textarea
            id="back"
            value={back}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBack(e.target.value)}
            placeholder="Enter the answer"
            required
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="form-textarea"
          />
          <div className="form-hint">This is what you're trying to remember</div>
        </div>

        <div className="form-preview">
          <div className="preview-label">Preview</div>
          <div className="preview-card">
            <div className="preview-front">
              <h3>{front || 'Question will appear here'}</h3>
            </div>
            <div className="preview-divider"></div>
            <div className="preview-back">
              <p>{back || 'Answer will appear here'}</p>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          className="btn-primary form-submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!front.trim() || !back.trim()}
        >
          Create Flashcard
        </motion.button>
      </form>
    </div>
  );
};

export default FlashcardForm;

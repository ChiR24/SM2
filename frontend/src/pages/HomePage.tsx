import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>SM2 Spaced Repetition System</h1>
        <p className="hero-subtitle">
          Learn efficiently with scientifically-proven spaced repetition
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Create Flashcards</h3>
            <p>
              Create digital flashcards with questions on the front and answers on the back.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Test Your Memory</h3>
            <p>
              Review flashcards and rate how well you remembered each one on a scale of 0-5.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Scheduling</h3>
            <p>
              The SM2 algorithm schedules reviews at optimal intervals based on your performance.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Learn Efficiently</h3>
            <p>
              Spend less time studying while achieving better long-term retention.
            </p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>About the SM2 Algorithm</h2>
        <p>
          The SuperMemo 2 (SM2) algorithm is a spaced repetition algorithm developed by Piotr Wozniak
          in the 1980s. It optimizes the learning process by scheduling reviews at increasing intervals
          based on how well you recall the information.
        </p>
        <p>
          When you review a flashcard, you rate your recall quality on a scale of 0-5:
        </p>
        <ul className="recall-grades">
          <li><strong>5</strong> - Perfect recall</li>
          <li><strong>4</strong> - Correct recall after hesitation</li>
          <li><strong>3</strong> - Correct recall with difficulty</li>
          <li><strong>2</strong> - Incorrect recall, but the answer seemed familiar</li>
          <li><strong>1</strong> - Incorrect recall, but you remembered after seeing the answer</li>
          <li><strong>0</strong> - Complete blackout</li>
        </ul>
        <p>
          Based on your rating, the algorithm adjusts the interval before the next review:
        </p>
        <ul>
          <li>Higher ratings (3-5) increase the interval</li>
          <li>Lower ratings (0-2) reset the interval to 1 day</li>
        </ul>
        <p>
          This approach ensures you review difficult items more frequently while spacing out reviews
          for items you know well, optimizing your study time.
        </p>
      </div>
    </div>
  );
};

export default HomePage;

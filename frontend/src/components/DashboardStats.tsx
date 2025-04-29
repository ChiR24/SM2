import React from 'react';
import './DashboardStats.css';

interface DashboardStatsProps {
  totalCards: number;
  dueCards: number;
  streak: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCards,
  dueCards,
  streak
}) => {
  // Calculate learning progress percentage
  const learningProgress = totalCards > 0 ? Math.round(((totalCards - dueCards) / totalCards) * 100) : 0;

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        {/* Due Today Card */}
        <div className="stat-card due-today">
          <div className="stat-card-inner">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Due Today</h3>
              <div className="stat-value">{dueCards}</div>
              <div className="stat-subtitle">cards to review</div>
            </div>
          </div>
          <div className="stat-pattern"></div>
        </div>

        {/* Total Cards Card */}
        <div className="stat-card total-cards">
          <div className="stat-card-inner">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Total Cards</h3>
              <div className="stat-value">{totalCards}</div>
              <div className="stat-subtitle">in your collection</div>
            </div>
          </div>
          <div className="stat-pattern"></div>
        </div>

        {/* Learning Progress Card */}
        <div className="stat-card learning-progress">
          <div className="stat-card-inner">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Learning Progress</h3>
              <div className="stat-value">{learningProgress}%</div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${learningProgress}%` }}
                ></div>
              </div>
              <div className="stat-subtitle">{totalCards - dueCards} of {totalCards} cards mastered</div>
            </div>
          </div>
          <div className="stat-pattern"></div>
        </div>

        {/* Current Streak Card */}
        <div className="stat-card current-streak">
          <div className="stat-card-inner">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Current Streak</h3>
              <div className="stat-value">{streak}</div>
              <div className="stat-subtitle">days</div>
            </div>
          </div>
          <div className="stat-pattern"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

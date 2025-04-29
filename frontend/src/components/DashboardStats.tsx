import React from 'react';
import './DashboardStats.css';

interface DashboardStatsProps {
  totalCards: number;
  dueCards: number;
  learningCards: number;
  masteredCards: number;
  retentionRate: number;
  streak: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCards,
  dueCards,
  learningCards,
  masteredCards,
  retentionRate,
  streak
}) => {
  // Calculate mastery percentage
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
  
  // Get trend indicators
  const getTrendIcon = (isPositive: boolean) => {
    return isPositive ? (
      <svg className="trend-icon trend-up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17l5-5 5 5"></path>
        <path d="M7 7h10v10"></path>
      </svg>
    ) : (
      <svg className="trend-icon trend-down" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7l5 5 5-5"></path>
        <path d="M7 17h10V7"></path>
      </svg>
    );
  };

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
              <div className="stat-value-group">
                <div className="stat-value">{learningCards}</div>
                <div className="stat-trend">
                  {getTrendIcon(true)}
                  <span>Learning</span>
                </div>
              </div>
              <div className="stat-value-group">
                <div className="stat-value">{masteredCards}</div>
                <div className="stat-trend">
                  {getTrendIcon(true)}
                  <span>Mastered</span>
                </div>
              </div>
            </div>
          </div>
          <div className="stat-pattern"></div>
        </div>

        {/* Mastery Rate Card */}
        <div className="stat-card mastery-rate">
          <div className="stat-card-inner">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Mastery Rate</h3>
              <div className="stat-value">{masteryPercentage}%</div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${masteryPercentage}%` }}
                ></div>
              </div>
              <div className="stat-subtitle">{totalCards} total cards</div>
            </div>
          </div>
          <div className="stat-pattern"></div>
        </div>

        {/* Retention Rate Card */}
        <div className="stat-card retention-rate">
          <div className="stat-card-inner">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20v-6M6 20V10M18 20V4"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Retention Rate</h3>
              <div className="stat-value">{retentionRate}%</div>
              <div className="stat-trend">
                {getTrendIcon(retentionRate >= 75)}
                <span>{retentionRate >= 75 ? 'Good' : 'Needs improvement'}</span>
              </div>
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

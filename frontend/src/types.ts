// User types
export interface User {
  id: string;
  username: string;
  email: string;
}

// Authentication types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Flashcard types for API
export interface Flashcard {
  _id: string;
  user: string;
  front: string;
  back: string;
  nextReviewDate: string;
  // Support both field names for compatibility
  repetition?: number;
  repetitions?: number;
  efactor: number;
  interval: number;
  createdAt: string;
  updatedAt: string;
  lastReviewDate?: string | null;
}



// Recall grade type (0-5)
export type RecallGrade = 0 | 1 | 2 | 3 | 4 | 5;

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Dashboard stats types
export interface DashboardStatsData {
  totalCards: number;
  dueCards: number;
  streak: number;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
}

// Flashcard types
export interface Flashcard {
  _id: string;
  front: string;
  back: string;
  interval: number;
  repetition: number;
  efactor: number;
  nextReviewDate: string;
  lastReviewDate: string | null;
  createdAt: string;
}

export interface FlashcardState {
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  currentFlashcard: Flashcard | null;
  loading: boolean;
  error: string | null;
}

// Review types
export type RecallGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewState {
  currentIndex: number;
  showAnswer: boolean;
  completed: boolean;
}

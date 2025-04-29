import axios from 'axios';

// Use the correct API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/users/register', userData),

  login: (userData: { email: string; password: string }) =>
    api.post('/users/login', userData),

  getProfile: () =>
    api.get('/users/profile'),
};

// Flashcard API
export const flashcardAPI = {
  getFlashcards: () =>
    api.get('/flashcards'),

  getDueFlashcards: () =>
    api.get('/flashcards/due'),

  createFlashcard: (flashcardData: { front: string; back: string }) =>
    api.post('/flashcards', flashcardData),

  updateFlashcard: (id: string, flashcardData: { front?: string; back?: string }) =>
    api.put(`/flashcards/${id}`, flashcardData),

  deleteFlashcard: (id: string) =>
    api.delete(`/flashcards/${id}`),

  reviewFlashcard: (id: string, grade: number) =>
    api.post(`/flashcards/${id}/review`, { grade }),
};

export default api;

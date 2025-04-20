import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FlashcardsPage from './pages/FlashcardsPage';
import ReviewPage from './pages/ReviewPage';

// Services
import { authAPI } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Handle user logout
  // This function is passed to the Navbar component to ensure that
  // the authentication state is properly updated when the user logs out
  // Fix for the issue where the UI still showed the user as logged in after logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Update authentication state to reflect that the user is no longer logged in
    // This ensures that the UI is updated correctly
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} username={user?.username} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/flashcards" /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/flashcards" /> : <RegisterPage />} />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <FlashcardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

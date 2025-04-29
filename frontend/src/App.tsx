import React from 'react';
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

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, user, loading, logout } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} username={user?.username} onLogout={logout} />
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
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

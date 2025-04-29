import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Attempting to login with:', { email });

      const response = await authAPI.login({ email, password });
      console.log('Login response:', response.data);

      // Use the login function from AuthContext to update auth state
      await login(response.data.token);

      // Redirect to flashcards page
      navigate('/flashcards');
    } catch (err: any) {
      console.error('Login error:', err);

      // For debugging purposes, show more detailed error information
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Login failed: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('Network error. Please check your connection.');
      } else {
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
      }

      setLoading(false);
    }
  };

  // For testing purposes - direct login without API
  const handleDirectLogin = async () => {
    try {
      // Create a fake token
      const fakeToken = 'test_token_' + Date.now();

      // Set user data directly
      const fakeUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com'
      };

      // Use the login function from AuthContext with the fake user data
      await login(fakeToken, fakeUser);

      // Navigate to flashcards page
      navigate('/flashcards');
    } catch (err) {
      console.error('Direct login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Direct login button for testing */}
        <div style={{ marginTop: '1rem' }}>
          <button
            className="btn-secondary"
            onClick={handleDirectLogin}
            style={{ width: '100%' }}
          >
            Test Login (Bypass API)
          </button>
        </div>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
// Import the real API instead of the mock API
import { authAPI, checkServerAvailability } from '../services/realApi';
import AsyncStorageWeb from '../utils/AsyncStorageWeb';
import { useConnection } from './ConnectionContext';
import { createLogger } from '../utils/logger';

const logger = createLogger('AuthContext');

// Use AsyncStorage for React Native and localStorage for web
const AsyncStorage = AsyncStorageWeb;

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the connection context
  const connection = useConnection();

  // Check if the user is logged in on app start
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Get the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');
        const offlineUserData = await AsyncStorage.getItem('offlineUser');

        logger.debug('Checking login status', {
          hasToken: !!token,
          hasUserData: !!userData,
          hasOfflineUserData: !!offlineUserData,
          isOfflineMode: connection.isOfflineMode
        });

        // Check if we're in offline mode
        if (connection.isOfflineMode && offlineUserData) {
          // If offline user data exists, set the user as authenticated
          setUser(JSON.parse(offlineUserData));
          setIsAuthenticated(true);
          logger.info('User is authenticated in offline mode');
        } else if (token && userData) {
          // If token exists, set the user as authenticated
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
          logger.info('User is authenticated');
        } else {
          logger.info('User is not authenticated');
        }
      } catch (err) {
        logger.error('Error checking authentication status:', err);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [connection.isOfflineMode]);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    // Check if we're in offline mode
    if (connection.isOfflineMode) {
      logger.info('In offline mode, using mock register');

      // Simple mock registration for offline mode
      const mockUser = {
        id: 'offline-user',
        username: userData.username,
        email: userData.email
      };

      // Store mock user data
      await AsyncStorage.setItem('offlineUser', JSON.stringify(mockUser));

      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
      setLoading(false);

      return { success: true };
    }

    // Check if the server is available
    if (!connection.isConnected) {
      logger.warn('Server is not connected, checking connection...');
      await connection.checkConnection();

      if (!connection.isConnected) {
        setLoading(false);
        const errorMsg = 'Cannot connect to the server. Please make sure the backend server is running.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    }

    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      // Save the token and user data
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      logger.error('Registration error', err);

      let errorMessage = 'Registration failed';

      // Handle specific error cases
      if (err.message && err.message.includes('Cannot connect to the server')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.';
      } else if (err.message && err.message.includes('endpoint not found')) {
        errorMessage = 'Registration endpoint not found. Please check the API URL and make sure the backend server is running.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data.message || 'Registration failed. Please check your information.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      logger.warn('Setting error message', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (credentials) => {
    logger.info('Login attempt', { email: credentials.email, passwordLength: credentials.password?.length });
    setLoading(true);
    setError(null);

    // Check if we're in offline mode
    if (connection.isOfflineMode) {
      logger.info('In offline mode, using mock login');

      // Simple mock login for offline mode
      // In a real app, you would check against locally stored credentials
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const mockUser = {
          id: 'offline-user',
          username: 'Offline User',
          email: credentials.email
        };

        // Store mock user data
        await AsyncStorage.setItem('offlineUser', JSON.stringify(mockUser));

        // Update state
        setUser(mockUser);
        setIsAuthenticated(true);
        setLoading(false);

        return { success: true };
      } else {
        setLoading(false);
        setError('Invalid credentials. In offline mode, use demo@example.com / password');
        return {
          success: false,
          error: 'Invalid credentials. In offline mode, use demo@example.com / password'
        };
      }
    }

    // Check if the server is available
    if (!connection.isConnected) {
      logger.warn('Server is not connected, checking connection...');
      await connection.checkConnection();

      if (!connection.isConnected) {
        setLoading(false);
        const errorMsg = 'Cannot connect to the server. Please make sure the backend server is running.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    }

    try {
      logger.debug('Calling authAPI.login');
      const response = await authAPI.login(credentials);
      logger.debug('Login response received');

      const { token, user } = response.data;

      // Store token and user data
      logger.debug('Storing token and user data');
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      logger.info('Login successful');
      return { success: true };
    } catch (err) {
      logger.error('Login error', err);

      let errorMessage = 'Login failed';

      // Handle specific error cases
      if (err.message && err.message.includes('Cannot connect to the server')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.';
      } else if (err.message && err.message.includes('endpoint not found')) {
        errorMessage = 'Login endpoint not found. Please check the API URL and make sure the backend server is running.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      logger.warn('Setting error message', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout a user
  const logout = async () => {
    logger.info('Logging out user');
    setLoading(true);

    try {
      // Call the logout API (if needed)
      await authAPI.logout();
      logger.debug('Logout API call successful');
    } catch (err) {
      logger.error('Error during logout:', err);
    } finally {
      // Clear the token and user data regardless of API call success
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      logger.debug('User data cleared from storage');

      // Update state
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      logger.info('User logged out successfully');
    }
  };

  // Check if we're in offline mode
  const isOfflineMode = connection.isOfflineMode;

  // Value to be provided by the context
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    isOfflineMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

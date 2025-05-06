import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create the context
const ConnectionContext = createContext();

// Custom hook to use the connection context
export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};

// Connection status constants
export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DISCONNECTED: 'disconnected',
  OFFLINE: 'offline',
};

// Connection provider component
export const ConnectionProvider = ({ children, serverUrl = 'http://localhost:5000' }) => {
  const [status, setStatus] = useState(CONNECTION_STATUS.CONNECTING);
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(false);

  // Check connection status
  const checkConnection = useCallback(async (silent = false) => {
    // If we're in offline mode, don't check connection
    if (isOfflineMode) {
      return false;
    }

    // If we're already checking, don't start another check
    if (checkingConnection && silent) {
      return false;
    }

    // If we've already checked recently (within the last 10 seconds) and it's a silent check, skip
    if (silent && lastChecked && (new Date().getTime() - lastChecked.getTime() < 10000)) {
      return status === CONNECTION_STATUS.CONNECTED;
    }

    if (!silent) {
      setStatus(CONNECTION_STATUS.CONNECTING);
      setError(null);
    }

    setCheckingConnection(true);

    try {
      // Try to connect to the backend server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await axios.get(serverUrl, {
        timeout: 3000,
        signal: controller.signal,
        // Add a timestamp to prevent caching
        params: { _t: new Date().getTime() }
      });

      clearTimeout(timeoutId);

      // Only log if not silent to reduce console noise
      if (!silent) {
        console.log('ConnectionContext: Server is available');
      }
      setStatus(CONNECTION_STATUS.CONNECTED);
      setLastChecked(new Date());
      setRetryCount(0);
      setCheckingConnection(false);
      return true;
    } catch (error) {
      // Don't log every silent check error to reduce console noise
      if (!silent) {
        console.error('ConnectionContext: Server is not available', error.message);
      }

      setStatus(CONNECTION_STATUS.DISCONNECTED);
      setError(error.message);
      setLastChecked(new Date());
      setCheckingConnection(false);
      return false;
    }
  }, [serverUrl, isOfflineMode, checkingConnection, lastChecked, status]);

  // Retry connection
  const retryConnection = useCallback(async () => {
    setRetryCount(prev => prev + 1);
    return await checkConnection(false);
  }, [checkConnection]);

  // Toggle offline mode
  const toggleOfflineMode = useCallback(() => {
    const newOfflineMode = !isOfflineMode;
    setIsOfflineMode(newOfflineMode);

    if (newOfflineMode) {
      setStatus(CONNECTION_STATUS.OFFLINE);
    } else {
      // If we're turning off offline mode, check connection
      checkConnection(false);
    }
  }, [isOfflineMode, checkConnection]);

  // Check connection on mount and when dependencies change
  useEffect(() => {
    // Only check connection if we're not in offline mode
    if (!isOfflineMode) {
      checkConnection(true);
    }
  }, [checkConnection, isOfflineMode]);

  // Set up interval to check connection periodically
  useEffect(() => {
    // Only set up interval if we're not in offline mode
    if (isOfflineMode) {
      return;
    }

    // Initial check
    checkConnection(true);

    // Check connection every 2 minutes (reduced frequency to avoid too many requests)
    const intervalId = setInterval(() => {
      // Only check if we're not already in a connected state to reduce unnecessary requests
      if (status !== CONNECTION_STATUS.CONNECTED) {
        checkConnection(true);
      }
    }, 120000); // 2 minutes

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [checkConnection, isOfflineMode, status]);

  // Value to be provided by the context
  const value = {
    status,
    lastChecked,
    error,
    retryCount,
    isOfflineMode,
    isConnected: status === CONNECTION_STATUS.CONNECTED,
    isConnecting: status === CONNECTION_STATUS.CONNECTING,
    isDisconnected: status === CONNECTION_STATUS.DISCONNECTED,
    isOffline: status === CONNECTION_STATUS.OFFLINE,
    checkConnection,
    retryConnection,
    toggleOfflineMode,
  };

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

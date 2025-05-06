import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useConnection, CONNECTION_STATUS } from '../context/ConnectionContext';

const ConnectionStatus = () => {
  const {
    status,
    error,
    retryConnection,
    toggleOfflineMode,
    isOfflineMode,
    retryCount
  } = useConnection();

  // Don't show anything if connected
  if (status === CONNECTION_STATUS.CONNECTED) {
    return null;
  }

  return (
    <View style={styles.container}>
      {status === CONNECTION_STATUS.CONNECTING ? (
        <View style={styles.connectingContainer}>
          <ActivityIndicator size="small" color="#856404" style={styles.spinner} />
          <Text style={styles.connectingText}>Connecting to server...</Text>
        </View>
      ) : status === CONNECTION_STATUS.OFFLINE ? (
        <View>
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>
              You are in offline mode. Some features may not be available.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.onlineButton}
            onPress={toggleOfflineMode}
          >
            <Text style={styles.buttonText}>Go Online</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.errorText}>
            Cannot connect to server. The backend server may not be running.
          </Text>
          <Text style={styles.errorSubText}>
            You can continue in offline mode or retry the connection.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={retryConnection}
            >
              <Text style={styles.buttonText}>Retry Connection</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.offlineButton}
              onPress={toggleOfflineMode}
            >
              <Text style={styles.buttonText}>Work Offline</Text>
            </TouchableOpacity>
          </View>
          {retryCount > 0 && (
            <Text style={styles.retryCountText}>
              Retry attempts: {retryCount}
            </Text>
          )}
          {error && (
            <Text style={styles.errorDetailsText}>
              Error details: {error}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  connectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  spinner: {
    marginRight: 10,
  },
  connectingText: {
    color: '#856404',
    textAlign: 'center',
    fontSize: 14,
  },
  offlineContainer: {
    backgroundColor: '#d1ecf1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  offlineText: {
    color: '#0c5460',
    textAlign: 'center',
    fontSize: 14,
  },
  errorText: {
    color: '#721c24',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  errorSubText: {
    color: '#721c24',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#4A6FA5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  offlineButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  onlineButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  retryCountText: {
    color: '#6c757d',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  errorDetailsText: {
    color: '#6c757d',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ConnectionStatus;

/**
 * Centralized logging utility for the SM2 Flashcard App
 * Provides consistent logging with different levels and can be disabled in production
 */

// Log levels
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4, // Use this to disable all logging
};

// Default configuration
const defaultConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  enableTimestamp: true,
  enableNamespace: true,
};

// Current configuration
let config = { ...defaultConfig };

/**
 * Configure the logger
 * @param {Object} newConfig - Configuration options
 * @param {LogLevel} newConfig.level - Minimum log level to display
 * @param {boolean} newConfig.enableTimestamp - Whether to include timestamps in logs
 * @param {boolean} newConfig.enableNamespace - Whether to include namespaces in logs
 */
export const configureLogger = (newConfig) => {
  config = { ...config, ...newConfig };
};

/**
 * Format a log message
 * @param {string} namespace - The namespace for the log (e.g., component or module name)
 * @param {string} level - The log level name
 * @param {string} message - The log message
 * @param {Array} args - Additional arguments to log
 * @returns {Array} - Formatted log arguments
 */
const formatLog = (namespace, level, message, args) => {
  const logArgs = [];
  
  let logMessage = '';
  
  // Add timestamp if enabled
  if (config.enableTimestamp) {
    const timestamp = new Date().toISOString();
    logMessage += `[${timestamp}] `;
  }
  
  // Add log level
  logMessage += `[${level}] `;
  
  // Add namespace if enabled
  if (config.enableNamespace && namespace) {
    logMessage += `[${namespace}] `;
  }
  
  // Add message
  logMessage += message;
  
  logArgs.push(logMessage);
  
  // Add additional arguments
  if (args && args.length > 0) {
    logArgs.push(...args);
  }
  
  return logArgs;
};

/**
 * Create a logger instance with a specific namespace
 * @param {string} namespace - The namespace for the logger
 * @returns {Object} - Logger instance with debug, info, warn, and error methods
 */
export const createLogger = (namespace) => {
  return {
    /**
     * Log a debug message
     * @param {string} message - The message to log
     * @param {...any} args - Additional arguments to log
     */
    debug: (message, ...args) => {
      if (config.level <= LogLevel.DEBUG) {
        console.log(...formatLog(namespace, 'DEBUG', message, args));
      }
    },
    
    /**
     * Log an info message
     * @param {string} message - The message to log
     * @param {...any} args - Additional arguments to log
     */
    info: (message, ...args) => {
      if (config.level <= LogLevel.INFO) {
        console.info(...formatLog(namespace, 'INFO', message, args));
      }
    },
    
    /**
     * Log a warning message
     * @param {string} message - The message to log
     * @param {...any} args - Additional arguments to log
     */
    warn: (message, ...args) => {
      if (config.level <= LogLevel.WARN) {
        console.warn(...formatLog(namespace, 'WARN', message, args));
      }
    },
    
    /**
     * Log an error message
     * @param {string} message - The message to log
     * @param {...any} args - Additional arguments to log
     */
    error: (message, ...args) => {
      if (config.level <= LogLevel.ERROR) {
        console.error(...formatLog(namespace, 'ERROR', message, args));
      }
    },
  };
};

// Default logger (without namespace)
export const logger = createLogger('App');

export default {
  createLogger,
  configureLogger,
  LogLevel,
  logger,
};

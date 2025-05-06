/**
 * Optimized AsyncStorage implementation for web using localStorage
 * with fallback to memory storage when localStorage is not available
 */
import { createLogger } from './logger';

const logger = createLogger('AsyncStorageWeb');

// Memory fallback if localStorage is not available
const memoryStorage = new Map();

// Check localStorage availability once at initialization
const isLocalStorageAvailable = (() => {
  try {
    const testKey = '__test_key__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    logger.info('localStorage is available');
    return true;
  } catch (e) {
    logger.warn('localStorage is not available, using memory storage fallback', e);
    return false;
  }
})();

// Cache for frequently accessed items
const cache = new Map();

// Helper to get storage based on availability
const getStorage = () => isLocalStorageAvailable ? localStorage : memoryStorage;

// Helper to get item from storage
const getFromStorage = (key) => {
  // Check cache first
  if (cache.has(key)) {
    logger.debug('Cache hit for key', key);
    return cache.get(key);
  }

  // Get from storage
  let value;
  if (isLocalStorageAvailable) {
    value = localStorage.getItem(key);
  } else {
    value = memoryStorage.get(key) || null;
  }

  // Update cache
  if (value !== null) {
    cache.set(key, value);
  }

  return value;
};

// Helper to set item in storage
const setInStorage = (key, value) => {
  // Update cache
  cache.set(key, value);

  // Update storage
  if (isLocalStorageAvailable) {
    localStorage.setItem(key, value);
  } else {
    memoryStorage.set(key, value);
  }
};

// Helper to remove item from storage
const removeFromStorage = (key) => {
  // Remove from cache
  cache.delete(key);

  // Remove from storage
  if (isLocalStorageAvailable) {
    localStorage.removeItem(key);
  } else {
    memoryStorage.delete(key);
  }
};

const AsyncStorageWeb = {
  getItem: (key) => {
    logger.debug('getItem', key);
    try {
      const value = getFromStorage(key);
      return Promise.resolve(value);
    } catch (error) {
      logger.error('getItem error', error);
      return Promise.reject(error);
    }
  },

  setItem: (key, value) => {
    logger.debug('setItem', key);
    try {
      setInStorage(key, value);
      return Promise.resolve();
    } catch (error) {
      logger.error('setItem error', error);
      return Promise.reject(error);
    }
  },

  removeItem: (key) => {
    logger.debug('removeItem', key);
    try {
      removeFromStorage(key);
      return Promise.resolve();
    } catch (error) {
      logger.error('removeItem error', error);
      return Promise.reject(error);
    }
  },

  clear: () => {
    logger.debug('clear');
    try {
      // Clear cache
      cache.clear();

      // Clear storage
      if (isLocalStorageAvailable) {
        localStorage.clear();
      } else {
        memoryStorage.clear();
      }
      return Promise.resolve();
    } catch (error) {
      logger.error('clear error', error);
      return Promise.reject(error);
    }
  },

  getAllKeys: () => {
    logger.debug('getAllKeys');
    try {
      let keys;
      if (isLocalStorageAvailable) {
        keys = Object.keys(localStorage);
      } else {
        keys = Array.from(memoryStorage.keys());
      }
      return Promise.resolve(keys);
    } catch (error) {
      logger.error('getAllKeys error', error);
      return Promise.reject(error);
    }
  },

  multiGet: (keys) => {
    logger.debug('multiGet', keys);
    try {
      const values = keys.map(key => [key, getFromStorage(key)]);
      return Promise.resolve(values);
    } catch (error) {
      logger.error('multiGet error', error);
      return Promise.reject(error);
    }
  },

  multiSet: (keyValuePairs) => {
    logger.debug('multiSet', keyValuePairs.length);
    try {
      keyValuePairs.forEach(([key, value]) => {
        setInStorage(key, value);
      });
      return Promise.resolve();
    } catch (error) {
      logger.error('multiSet error', error);
      return Promise.reject(error);
    }
  },

  multiRemove: (keys) => {
    logger.debug('multiRemove', keys);
    try {
      keys.forEach(key => {
        removeFromStorage(key);
      });
      return Promise.resolve();
    } catch (error) {
      logger.error('multiRemove error', error);
      return Promise.reject(error);
    }
  },
};

export default AsyncStorageWeb;

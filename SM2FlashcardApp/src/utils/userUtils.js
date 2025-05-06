/**
 * Utility functions for user-related operations
 */
import { createLogger } from './logger';

const logger = createLogger('UserUtils');

/**
 * Formats a user's display name based on available information
 * Prioritizes username over email
 * 
 * @param {Object} user - The user object
 * @param {string} user.username - The user's username (optional)
 * @param {string} user.email - The user's email (optional)
 * @returns {string} - The formatted display name
 */
export const formatUserDisplayName = (user) => {
  // First try to use username
  if (user?.username) {
    return user.username;
  }
  // Then try to use email (truncated)
  else if (user?.email) {
    const emailParts = user.email.split('@');
    return emailParts.length > 0 ? emailParts[0] : 'User';
  }
  // Fallback to default
  else {
    return 'User';
  }
};

/**
 * Gets the first letter of a user's display name for avatar
 * 
 * @param {Object} user - The user object
 * @returns {string} - The first letter of the user's display name
 */
export const getUserInitial = (user) => {
  const displayName = formatUserDisplayName(user);
  return displayName.charAt(0).toUpperCase();
};

export default {
  formatUserDisplayName,
  getUserInitial
};

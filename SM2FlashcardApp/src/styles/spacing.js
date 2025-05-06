/**
 * Enhanced spacing system for the SM2 Flashcard App
 * Using a more consistent and modern approach to spacing and elevation
 */

export const spacing = {
  // Base spacing unit: 4px with more granular options
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Specific spacing for different contexts
  gutter: 16,       // Standard padding for containers
  itemSpacing: 12,  // Space between related items
  sectionSpacing: 24, // Space between sections
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 16,  // Increased from 12 to 16 for a more modern look
  lg: 24,
  xl: 32,
  round: 9999, // For fully rounded elements like circular buttons
};

// Enhanced shadows for better depth perception
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
  // New focused shadow for interactive elements
  focused: {
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Helper function to convert shadow to box-shadow for web
export const shadowToBoxShadow = (shadow) => {
  return {
    boxShadow: `0px ${shadow.shadowOffset.height}px ${shadow.shadowRadius * 2}px rgba(0, 0, 0, ${shadow.shadowOpacity})`,
  };
};

export default {
  spacing,
  borderRadius,
  shadows,
  shadowToBoxShadow,
};

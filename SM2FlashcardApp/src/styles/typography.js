/**
 * Enhanced typography styles for the SM2 Flashcard App
 * Using a more modern type system with better hierarchy
 */

import { StyleSheet, Platform } from 'react-native';

// Define font families based on platform
// For Android, we'll use Roboto which is the default on most Android devices
// For iOS, we'll use the San Francisco font (System)
export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

// Enhanced font sizes with better scaling
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

// Line height multipliers for better readability
const lineHeightMultipliers = {
  tight: 1.2,    // For headings
  normal: 1.5,   // For body text
  relaxed: 1.7,  // For small text
};

export const typography = StyleSheet.create({
  // Display and Headings
  display: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.display,
    fontWeight: 'bold',
    lineHeight: fontSize.display * lineHeightMultipliers.tight,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    lineHeight: fontSize.xxxl * lineHeightMultipliers.tight,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    lineHeight: fontSize.xxl * lineHeightMultipliers.tight,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    lineHeight: fontSize.xl * lineHeightMultipliers.tight,
    letterSpacing: -0.1,
  },
  h4: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    fontWeight: '600',
    lineHeight: fontSize.lg * lineHeightMultipliers.tight,
  },

  // Body text with improved readability
  body1: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeightMultipliers.normal,
    letterSpacing: 0.1,
  },
  body2: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeightMultipliers.normal,
    letterSpacing: 0.1,
  },

  // Other text styles with enhanced readability and style
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeightMultipliers.relaxed,
    letterSpacing: 0.2,
    color: '#6C757D',
  },
  button: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    fontWeight: '600',
    lineHeight: fontSize.md * lineHeightMultipliers.tight,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    fontWeight: '500',
    lineHeight: fontSize.sm * lineHeightMultipliers.tight,
    letterSpacing: 0.2,
  },

  // New styles for enhanced UI
  subtitle1: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    fontWeight: '500',
    lineHeight: fontSize.md * lineHeightMultipliers.normal,
    letterSpacing: 0.1,
  },
  subtitle2: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    fontWeight: '500',
    lineHeight: fontSize.sm * lineHeightMultipliers.normal,
    letterSpacing: 0.1,
  },
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stat: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    lineHeight: fontSize.xxl * lineHeightMultipliers.tight,
    letterSpacing: -0.2,
  },
});

export default typography;

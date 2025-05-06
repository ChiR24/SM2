/**
 * Enhanced Card component for the SM2 Flashcard App
 * With modern styling, better shadows, and more variants
 */

import React from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, shadows, shadowToBoxShadow } from '../../styles/spacing';

const Card = ({
  children,
  variant = 'default',
  elevation = 'medium',
  style = {},
  onPress = null,
  activeOpacity = 0.7,
  rippleColor = colors.primaryLight,
  rippleOverflow = false,
}) => {
  // Determine card styles based on variant
  const getCardStyles = () => {
    switch (variant) {
      case 'default':
        return styles.defaultCard;
      case 'outlined':
        return styles.outlinedCard;
      case 'flat':
        return styles.flatCard;
      case 'primary':
        return styles.primaryCard;
      case 'success':
        return styles.successCard;
      case 'warning':
        return styles.warningCard;
      case 'danger':
        return styles.dangerCard;
      default:
        return styles.defaultCard;
    }
  };

  // Determine shadow based on elevation
  const getElevationStyles = () => {
    if (variant === 'flat') return {};

    switch (elevation) {
      case 'none':
        return Platform.OS === 'web'
          ? shadowToBoxShadow(shadows.none)
          : shadows.none;
      case 'light':
        return Platform.OS === 'web'
          ? shadowToBoxShadow(shadows.light)
          : shadows.light;
      case 'medium':
        return Platform.OS === 'web'
          ? shadowToBoxShadow(shadows.medium)
          : shadows.medium;
      case 'heavy':
        return Platform.OS === 'web'
          ? shadowToBoxShadow(shadows.heavy)
          : shadows.heavy;
      default:
        return Platform.OS === 'web'
          ? shadowToBoxShadow(shadows.medium)
          : shadows.medium;
    }
  };

  // Render as pressable if onPress is provided
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          getCardStyles(),
          getElevationStyles(),
          pressed && styles.cardPressed,
          style,
        ]}
        android_ripple={{
          color: rippleColor,
          borderless: false,
          foreground: rippleOverflow,
        }}
      >
        {children}
      </Pressable>
    );
  }

  // Regular non-pressable card
  return (
    <View
      style={[
        styles.card,
        getCardStyles(),
        getElevationStyles(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Card Header component with enhanced styling
export const CardHeader = ({ children, style = {}, variant = 'default' }) => {
  // Get header style based on variant
  const getHeaderStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryHeader;
      case 'success':
        return styles.successHeader;
      case 'warning':
        return styles.warningHeader;
      case 'danger':
        return styles.dangerHeader;
      default:
        return {};
    }
  };

  return (
    <View style={[styles.cardHeader, getHeaderStyle(), style]}>
      {children}
    </View>
  );
};

// Card Content component
export const CardContent = ({ children, style = {} }) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);

// Card Footer component
export const CardFooter = ({ children, style = {}, variant = 'default' }) => {
  // Get footer style based on variant
  const getFooterStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryFooter;
      case 'success':
        return styles.successFooter;
      case 'warning':
        return styles.warningFooter;
      case 'danger':
        return styles.dangerFooter;
      default:
        return {};
    }
  };

  return (
    <View style={[styles.cardFooter, getFooterStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  cardPressed: {
    opacity: 0.9,
  },
  defaultCard: {
    backgroundColor: colors.cardBackground,
  },
  outlinedCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flatCard: {
    backgroundColor: colors.cardBackground,
  },
  primaryCard: {
    backgroundColor: colors.primaryBackground,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  successCard: {
    backgroundColor: colors.successLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  warningCard: {
    backgroundColor: colors.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  dangerCard: {
    backgroundColor: colors.dangerLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  cardHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  primaryHeader: {
    backgroundColor: colors.primary,
    borderBottomWidth: 0,
  },
  successHeader: {
    backgroundColor: colors.success,
    borderBottomWidth: 0,
  },
  warningHeader: {
    backgroundColor: colors.warning,
    borderBottomWidth: 0,
  },
  dangerHeader: {
    backgroundColor: colors.danger,
    borderBottomWidth: 0,
  },
  cardContent: {
    padding: spacing.md,
  },
  cardFooter: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryFooter: {
    backgroundColor: colors.primaryBackground,
    borderTopWidth: 0,
  },
  successFooter: {
    backgroundColor: colors.successLight,
    borderTopWidth: 0,
  },
  warningFooter: {
    backgroundColor: colors.warningLight,
    borderTopWidth: 0,
  },
  dangerFooter: {
    backgroundColor: colors.dangerLight,
    borderTopWidth: 0,
  },
});

export default Card;

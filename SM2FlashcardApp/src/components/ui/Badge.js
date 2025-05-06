/**
 * Enhanced Badge component for the SM2 Flashcard App
 * With improved styling and touch support
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius, shadows } from '../../styles/spacing';

const Badge = ({
  label,
  variant = 'default',
  size = 'medium',
  style = {},
  textStyle = {},
  onPress = null,
  activeOpacity = 0.7,
}) => {
  // Determine badge styles based on variant
  const getBadgeStyles = () => {
    switch (variant) {
      case 'default':
        return styles.defaultBadge;
      case 'primary':
        return styles.primaryBadge;
      case 'success':
        return styles.successBadge;
      case 'warning':
        return styles.warningBadge;
      case 'danger':
        return styles.dangerBadge;
      case 'outline':
        return styles.outlineBadge;
      case 'info':
        return styles.infoBadge;
      default:
        return styles.defaultBadge;
    }
  };

  // Determine text styles based on variant
  const getTextStyles = () => {
    switch (variant) {
      case 'default':
        return styles.defaultText;
      case 'primary':
      case 'success':
      case 'warning':
      case 'danger':
      case 'info':
        return styles.lightText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.defaultText;
    }
  };

  // Determine badge size
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.smallBadge;
      case 'medium':
        return styles.mediumBadge;
      case 'large':
        return styles.largeBadge;
      default:
        return styles.mediumBadge;
    }
  };

  // Determine text size
  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  // Render as TouchableOpacity if onPress is provided
  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.badge,
          getBadgeStyles(),
          getSizeStyles(),
          style,
        ]}
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        <Text
          style={[
            styles.text,
            getTextStyles(),
            getTextSizeStyles(),
            textStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  // Regular non-touchable badge
  return (
    <View
      style={[
        styles.badge,
        getBadgeStyles(),
        getSizeStyles(),
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          getTextStyles(),
          getTextSizeStyles(),
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.light,
  },
  defaultBadge: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryBadge: {
    backgroundColor: colors.primary,
  },
  successBadge: {
    backgroundColor: colors.success,
  },
  warningBadge: {
    backgroundColor: colors.warning,
  },
  dangerBadge: {
    backgroundColor: colors.danger,
  },
  infoBadge: {
    backgroundColor: colors.info,
  },
  outlineBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  smallBadge: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    minHeight: 22,
  },
  mediumBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 28,
  },
  largeBadge: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  defaultText: {
    color: colors.textPrimary,
  },
  lightText: {
    color: colors.textLight,
  },
  outlineText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: typography.caption.fontSize,
  },
  mediumText: {
    fontSize: typography.caption.fontSize + 1,
  },
  largeText: {
    fontSize: typography.body2.fontSize,
    letterSpacing: 0.2,
  },
});

export default Badge;

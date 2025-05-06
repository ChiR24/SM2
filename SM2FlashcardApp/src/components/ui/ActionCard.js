/**
 * ActionCard component for the SM2 Flashcard App
 * A modern card component for action items with icon and gradient background
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius, shadows } from '../../styles/spacing';

const ActionCard = ({
  title,
  subtitle,
  icon,
  onPress,
  style,
  variant = 'default',
  disabled = false,
}) => {
  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: styles.primaryContainer,
          title: styles.lightTitle,
          subtitle: styles.lightSubtitle,
          icon: styles.lightIcon,
        };
      case 'success':
        return {
          container: styles.successContainer,
          title: styles.lightTitle,
          subtitle: styles.lightSubtitle,
          icon: styles.lightIcon,
        };
      case 'warning':
        return {
          container: styles.warningContainer,
          title: styles.lightTitle,
          subtitle: styles.lightSubtitle,
          icon: styles.lightIcon,
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          title: styles.lightTitle,
          subtitle: styles.lightSubtitle,
          icon: styles.lightIcon,
        };
      case 'outline':
        return {
          container: styles.outlineContainer,
          title: styles.darkTitle,
          subtitle: styles.darkSubtitle,
          icon: styles.darkIcon,
        };
      default:
        return {
          container: styles.defaultContainer,
          title: styles.darkTitle,
          subtitle: styles.darkSubtitle,
          icon: styles.darkIcon,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        variantStyles.container,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={disabled ? null : onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, variantStyles.title]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, variantStyles.subtitle]}>{subtitle}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  defaultContainer: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  successContainer: {
    backgroundColor: colors.success,
  },
  warningContainer: {
    backgroundColor: colors.warning,
  },
  dangerContainer: {
    backgroundColor: colors.danger,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.subtitle1,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    ...typography.body2,
  },
  darkTitle: {
    color: colors.textPrimary,
  },
  darkSubtitle: {
    color: colors.textSecondary,
  },
  lightTitle: {
    color: colors.textLight,
  },
  lightSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  darkIcon: {
    color: colors.primary,
  },
  lightIcon: {
    color: colors.textLight,
  },
});

export default ActionCard;

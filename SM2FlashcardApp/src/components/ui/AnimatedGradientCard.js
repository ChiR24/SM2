/**
 * AnimatedGradientCard component for the SM2 Flashcard App
 * Inspired by modern UI design with animated gradients
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Easing } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius, shadows } from '../../styles/spacing';

const AnimatedGradientCard = ({
  title,
  value,
  subtitle,
  gradientColors = [colors.primary, colors.primaryLight],
  onPress,
  style,
  delay = 0,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay * 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: delay * 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous gradient animation
    Animated.loop(
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ).start();
  }, [fadeAnim, scaleAnim, gradientAnim, delay]);

  // Interpolate gradient position
  const gradientPosition = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.container,
      style,
      pressed && styles.pressed,
    ]}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated gradient circles */}
        <Animated.View
          style={[
            styles.gradientCircle1,
            {
              backgroundColor: gradientColors[0],
              left: gradientPosition,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.gradientCircle2,
            {
              backgroundColor: gradientColors[1],
              right: gradientPosition,
            },
          ]}
        />

        {/* Card content */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    height: 120,
    backgroundColor: colors.cardBackground,
    ...shadows.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradientCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -50,
    opacity: 0.2,
  },
  gradientCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    bottom: -30,
    opacity: 0.15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  value: {
    ...typography.stat,
    color: colors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default AnimatedGradientCard;

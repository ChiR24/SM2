/**
 * ProgressBar component for the SM2 Flashcard App
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

const ProgressBar = ({
  progress = 0, // Value between 0 and 1
  color = colors.primary,
  height = 8,
  animated = true,
  animationDuration = 300,
  style = {},
  trackStyle = {},
  fillStyle = {},
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress);
    }
  }, [progress, animated, animationDuration, progressAnim]);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 0.3) {
      return colors.danger;
    } else if (progress < 0.7) {
      return colors.warning;
    } else {
      return colors.success;
    }
  };

  const progressColor = color === 'auto' ? getProgressColor() : color;

  return (
    <View
      style={[
        styles.container,
        { height },
        style,
      ]}
    >
      <View
        style={[
          styles.track,
          { height },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width,
              height,
              backgroundColor: progressColor,
            },
            fillStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  track: {
    width: '100%',
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: borderRadius.sm,
  },
});

export default ProgressBar;

/**
 * AnimatedFlashcard component for the SM2 Flashcard App
 * Enhanced with 3D flip animation
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius, shadows, shadowToBoxShadow } from '../../styles/spacing';
import Badge from './Badge';

const { width } = Dimensions.get('window');

const AnimatedFlashcard = ({
  front,
  back,
  category = 'General',
  isFlipped = false,
  onFlip,
  style = {},
}) => {
  const [flipped, setFlipped] = useState(isFlipped);
  const flipAnimation = useRef(new Animated.Value(isFlipped ? 1 : 0)).current;

  // Update component state when prop changes
  React.useEffect(() => {
    setFlipped(isFlipped);
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, flipAnimation]);

  const handleFlip = () => {
    const newFlippedState = !flipped;
    setFlipped(newFlippedState);
    
    Animated.timing(flipAnimation, {
      toValue: newFlippedState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    if (onFlip) {
      onFlip(newFlippedState);
    }
  };

  // Interpolate for front and back animations
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Interpolate for opacity to prevent text from showing through the card
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0.5, 0.5],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0.5, 0.5],
    outputRange: [0, 1],
  });

  const frontAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: frontInterpolate },
    ],
    opacity: frontOpacity,
    zIndex: flipped ? 0 : 1,
  };

  const backAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: backInterpolate },
    ],
    opacity: backOpacity,
    zIndex: flipped ? 1 : 0,
  };

  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <View style={[styles.container, style]}>
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            frontAnimatedStyle,
            Platform.OS === 'web' ? shadowToBoxShadow(shadows.medium) : shadows.medium,
          ]}
        >
          <Badge label={category} variant="primary" style={styles.categoryBadge} />
          <Text style={[typography.h3, styles.cardQuestion]}>{front}</Text>
          <Text style={styles.tapText}>Tap to flip</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            backAnimatedStyle,
            Platform.OS === 'web' ? shadowToBoxShadow(shadows.medium) : shadows.medium,
          ]}
        >
          <Badge label={category} variant="primary" style={styles.categoryBadge} />
          <Text style={[typography.body1, styles.cardAnswer]}>{back}</Text>
          <Text style={styles.tapText}>Tap to flip</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: colors.cardBackground,
  },
  cardBack: {
    backgroundColor: colors.background,
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  cardQuestion: {
    textAlign: 'center',
    color: colors.textPrimary,
  },
  cardAnswer: {
    textAlign: 'center',
    color: colors.textPrimary,
  },
  tapText: {
    position: 'absolute',
    bottom: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
  },
});

export default AnimatedFlashcard;

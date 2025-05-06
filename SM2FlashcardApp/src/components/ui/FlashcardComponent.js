/**
 * FlashcardComponent for the SM2 Flashcard App
 * A modern flashcard component with flip animation and rating buttons
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius, shadows } from '../../styles/spacing';
import Button from './Button';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const FlashcardComponent = ({
  flashcard,
  onRate,
  style,
}) => {
  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  // Handle card flip
  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;

    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    setIsFlipped(!isFlipped);
  };

  // Interpolate for front and back animations
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0.25, 0.55],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0.45, 0.75],
    outputRange: [0, 1],
  });

  const frontStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const backStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  // Render rating buttons
  const renderRatingButtons = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Rate your recall:</Text>
        <View style={styles.ratingButtonsContainer}>
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                { backgroundColor: getRatingColor(rating) },
              ]}
              onPress={() => onRate(rating)}
            >
              <Text style={styles.ratingButtonText}>{rating}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.ratingLabelsContainer}>
          <Text style={styles.ratingLabelLeft}>Difficult</Text>
          <Text style={styles.ratingLabelRight}>Easy</Text>
        </View>
      </View>
    );
  };

  // Get color based on rating
  const getRatingColor = (rating) => {
    if (rating <= 1) return colors.danger;
    if (rating <= 2) return colors.warning;
    if (rating <= 3) return colors.info;
    if (rating <= 4) return colors.primary;
    return colors.success;
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={handleFlip}>
        {/* Front of card */}
        <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardCount}>
              EF: {flashcard.easeFactor?.toFixed(2) || '2.50'}
            </Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              {flashcard.front || flashcard.question}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardHint}>Tap to flip</Text>
          </View>
        </Animated.View>

        {/* Back of card */}
        <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardCount}>
              Interval: {flashcard.interval || 1} day(s)
            </Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              {flashcard.back || flashcard.answer}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            {renderRatingButtons()}
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    perspective: 1000,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    backfaceVisibility: 'hidden',
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  cardFront: {
    backgroundColor: colors.cardBackground,
    position: 'absolute',
  },
  cardBack: {
    backgroundColor: colors.cardBackground,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  cardFooter: {
    alignItems: 'center',
  },
  cardText: {
    ...typography.h3,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  cardHint: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  cardCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ratingContainer: {
    width: '100%',
  },
  ratingTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  ratingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  ratingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.light,
  },
  ratingButtonText: {
    ...typography.button,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  ratingLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingLabelLeft: {
    ...typography.caption,
    color: colors.danger,
  },
  ratingLabelRight: {
    ...typography.caption,
    color: colors.success,
  },
});

export default FlashcardComponent;

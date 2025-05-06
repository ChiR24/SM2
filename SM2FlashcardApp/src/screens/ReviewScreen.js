import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { useFlashcards } from '../context/FlashcardContext';

// Import our new UI components
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import FlashcardComponent from '../components/ui/FlashcardComponent';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius, shadows, shadowToBoxShadow } from '../styles/spacing';
import { createLogger } from '../utils/logger';

const logger = createLogger('ReviewScreen');
const { width } = Dimensions.get('window');

// Memoized button component for better performance
const RatingButton = memo(({ title, onPress, disabled, variant, size, style, textStyle, loading }) => (
  <Button
    title={title}
    onPress={onPress}
    disabled={disabled}
    variant={variant}
    size={size}
    style={style}
    textStyle={textStyle}
    loading={loading}
  />
));

const ReviewScreen = ({ navigation }) => {
  const { dueFlashcards, reviewFlashcard, loading } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    perfect: 0,  // 5
    good: 0,     // 4
    difficult: 0, // 3
    almost: 0,   // 2
    wrong: 0,    // 1
    blackout: 0, // 0
  });

  // Check if there are flashcards to review
  useEffect(() => {
    if (dueFlashcards.length === 0 && !loading) {
      setReviewComplete(true);
    } else {
      setStats(prev => ({ ...prev, total: dueFlashcards.length }));

      // Ensure currentIndex is valid
      if (currentIndex >= dueFlashcards.length) {
        // If we're beyond the available cards, either reset to 0 or mark as complete
        if (dueFlashcards.length > 0) {
          setCurrentIndex(0);
        } else {
          setReviewComplete(true);
        }
      }
    }
  }, [dueFlashcards, loading, currentIndex]);

  // Get the current flashcard
  const currentFlashcard = dueFlashcards && dueFlashcards.length > 0 && currentIndex < dueFlashcards.length
    ? dueFlashcards[currentIndex]
    : null;



  // Update stats based on quality - extracted for better organization
  const updateStats = useCallback((quality) => {
    logger.debug('Updating stats for quality', quality);
    setStats(prev => {
      const newStats = { ...prev };

      switch (quality) {
        case 5:
          newStats.perfect += 1;
          break;
        case 4:
          newStats.good += 1;
          break;
        case 3:
          newStats.difficult += 1;
          break;
        case 2:
          newStats.almost += 1;
          break;
        case 1:
          newStats.wrong += 1;
          break;
        case 0:
          newStats.blackout += 1;
          break;
      }

      return newStats;
    });
  }, []);

  // Handle flashcard review - memoized to prevent unnecessary re-renders
  const handleReview = useCallback(async (quality) => {
    if (isReviewing || !currentFlashcard) {
      logger.debug('Ignoring review request - already reviewing or no flashcard');
      return;
    }

    logger.info('Reviewing flashcard with quality', quality);
    setIsReviewing(true);

    try {
      // Update stats based on quality
      updateStats(quality);

      // Store the current flashcard ID before review
      const reviewedCardId = currentFlashcard.id;

      // Review the flashcard
      await reviewFlashcard(reviewedCardId, quality);
      logger.debug('Flashcard reviewed successfully');

      // Card will reset automatically when we move to the next card

      // Check if there are any cards left to review after this one
      if (dueFlashcards.length <= 1) {
        // This was the last card, so mark review as complete
        logger.info('Review complete - no more cards');
        setReviewComplete(true);
      } else if (currentIndex >= dueFlashcards.length - 1) {
        // We're at the end of the list, but there are still cards
        // (This can happen if cards were added during review)
        logger.debug('Reached end of list, resetting to beginning');
        setCurrentIndex(0);
      } else {
        // Move to the next card
        logger.debug('Moving to next card');
        setCurrentIndex(currentIndex + 1);
      }
    } catch (err) {
      logger.error('Review error:', err);
      Alert.alert('Error', 'Failed to review flashcard');
    } finally {
      setIsReviewing(false);
    }
  }, [isReviewing, currentFlashcard, updateStats, reviewFlashcard, dueFlashcards.length, currentIndex]);



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading flashcards...</Text>
      </View>
    );
  }

  if (reviewComplete) {
    return (
      <View style={styles.completeContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

        <View style={styles.completeHeader}>
          <Text style={styles.completeTitle}>Review Complete!</Text>
          <Text style={styles.completeSubtitle}>Great job on your review session</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.totalStatsCard}>
            <Text style={styles.totalStatsNumber}>{stats.total}</Text>
            <Text style={styles.totalStatsLabel}>Total Cards</Text>
            <View style={styles.totalStatsBar} />
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.perfectStatCard]}>
              <Text style={styles.statNumber}>{stats.perfect}</Text>
              <Text style={styles.statLabel}>Perfect (5)</Text>
              <View style={[styles.cardIndicator, styles.perfectIndicator]} />
            </View>

            <View style={[styles.statCard, styles.goodStatCard]}>
              <Text style={styles.statNumber}>{stats.good}</Text>
              <Text style={styles.statLabel}>Good (4)</Text>
              <View style={[styles.cardIndicator, styles.goodIndicator]} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.difficultStatCard]}>
              <Text style={styles.statNumber}>{stats.difficult}</Text>
              <Text style={styles.statLabel}>Difficult (3)</Text>
              <View style={[styles.cardIndicator, styles.difficultIndicator]} />
            </View>

            <View style={[styles.statCard, styles.almostStatCard]}>
              <Text style={styles.statNumber}>{stats.almost}</Text>
              <Text style={styles.statLabel}>Almost (2)</Text>
              <View style={[styles.cardIndicator, styles.almostIndicator]} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.wrongStatCard]}>
              <Text style={styles.statNumber}>{stats.wrong}</Text>
              <Text style={styles.statLabel}>Wrong (1)</Text>
              <View style={[styles.cardIndicator, styles.wrongIndicator]} />
            </View>

            <View style={[styles.statCard, styles.blackoutStatCard]}>
              <Text style={styles.statNumber}>{stats.blackout}</Text>
              <Text style={styles.statLabel}>Blackout (0)</Text>
              <View style={[styles.cardIndicator, styles.blackoutIndicator]} />
            </View>
          </View>
        </View>

        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Home')}
          variant="primary"
          size="large"
          fullWidth
          style={styles.homeButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.progressText}>
          {dueFlashcards.length > 0
            ? `Card ${currentIndex < dueFlashcards.length ? currentIndex + 1 : dueFlashcards.length} of ${dueFlashcards.length}`
            : 'No cards to review'
          }
        </Text>
        <ProgressBar
          progress={dueFlashcards.length > 0 ? Math.min((currentIndex + 1) / dueFlashcards.length, 1) : 0}
          color={colors.primary}
          height={8}
          animated={true}
          style={styles.progressBar}
        />
      </View>

      <View style={styles.cardContainer}>
        {currentFlashcard ? (
          <FlashcardComponent
            flashcard={currentFlashcard}
            onRate={handleReview}
            style={styles.flashcard}
          />
        ) : (
          <Card style={styles.emptyStateContainer} elevation="medium">
            <CardContent style={styles.emptyStateContent}>
              <Text style={styles.emptyStateText}>No flashcards due for review</Text>
              <Button
                title="Back to Home"
                onPress={() => navigation.navigate('Home')}
                variant="primary"
                size="medium"
                style={styles.emptyStateButton}
              />
            </CardContent>
          </Card>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    ...typography.body1,
    color: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  progressText: {
    ...typography.body1,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  progressBar: {
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  flashcard: {
    ...Platform.select({
      web: {
        ...shadowToBoxShadow(shadows.heavy),
      },
      default: shadows.heavy,
    }),
  },
  emptyStateContainer: {
    width: width - 40,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyStateButton: {
    marginTop: spacing.md,
  },
  ratingContainer: {
    padding: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ratingTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  ratingSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  ratingButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  blackoutButton: {
    borderColor: '#FF0000', // Bright red
  },
  blackoutButtonText: {
    color: '#FF0000',
  },
  wrongButton: {
    borderColor: '#FF4500', // OrangeRed
  },
  wrongButtonText: {
    color: '#FF4500',
  },
  almostButton: {
    borderColor: '#FFA500', // Orange
  },
  almostButtonText: {
    color: '#FFA500',
  },
  difficultButton: {
    borderColor: colors.warning,
  },
  difficultButtonText: {
    color: colors.warning,
  },
  goodButton: {
    borderColor: '#4CAF50', // Green
  },
  goodButtonText: {
    color: '#4CAF50',
  },
  perfectButton: {
    borderColor: colors.success,
  },
  perfectButtonText: {
    color: colors.success,
  },
  completeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  completeHeader: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  completeTitle: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  completeSubtitle: {
    ...typography.subtitle1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: spacing.xl,
  },
  totalStatsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  totalStatsNumber: {
    ...typography.h1,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalStatsLabel: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  totalStatsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.sm,
  },
  statCard: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.medium,
    backgroundColor: colors.cardBackground,
    position: 'relative',
    overflow: 'hidden',
  },
  statNumber: {
    ...typography.h2,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cardIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 6,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  perfectStatCard: {
    backgroundColor: colors.cardBackground,
  },
  perfectIndicator: {
    backgroundColor: colors.success,
  },
  goodStatCard: {
    backgroundColor: colors.cardBackground,
  },
  goodIndicator: {
    backgroundColor: colors.primary,
  },
  difficultStatCard: {
    backgroundColor: colors.cardBackground,
  },
  difficultIndicator: {
    backgroundColor: colors.info,
  },
  almostStatCard: {
    backgroundColor: colors.cardBackground,
  },
  almostIndicator: {
    backgroundColor: colors.warning,
  },
  wrongStatCard: {
    backgroundColor: colors.cardBackground,
  },
  wrongIndicator: {
    backgroundColor: colors.danger,
  },
  blackoutStatCard: {
    backgroundColor: colors.cardBackground,
  },
  blackoutIndicator: {
    backgroundColor: colors.dark,
  },
  homeButton: {
    marginTop: spacing.lg,
    width: '100%',
    backgroundColor: colors.primary,
    ...shadows.medium,
  },
});

export default ReviewScreen;

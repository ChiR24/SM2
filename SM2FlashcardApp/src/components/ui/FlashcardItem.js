/**
 * FlashcardItem component for the SM2 Flashcard App
 * Used in the Flashcards list screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius, shadows, shadowToBoxShadow } from '../../styles/spacing';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import Button from './Button';

const FlashcardItem = ({
  item,
  onEdit,
  onDelete,
  style = {},
}) => {
  // Calculate progress based on ease factor and repetitions
  const progress = Math.min(1, (item.easeFactor - 1.3) / 1.7);

  // Determine progress color based on progress value
  const getProgressColor = () => {
    if (progress < 0.3) {
      return colors.danger;
    } else if (progress < 0.7) {
      return colors.warning;
    } else {
      return colors.success;
    }
  };

  // Get learning status label based on repetitions and ease factor
  const getLearningStatus = () => {
    if (item.repetitions === 0) {
      return { label: 'New', color: colors.info };
    } else if (item.repetitions < 3) {
      return { label: 'Learning', color: colors.warning };
    } else if (item.easeFactor < 2.0) {
      return { label: 'Difficult', color: colors.danger };
    } else if (item.easeFactor >= 2.5) {
      return { label: 'Mastered', color: colors.success };
    } else {
      return { label: 'Reviewing', color: colors.primary };
    }
  };

  const learningStatus = getLearningStatus();

  // Format the next review date
  const formatNextReviewDate = (dateString) => {
    // Add debugging to identify the issue
    console.log(`[FlashcardItem] nextReviewDate: ${dateString}, type: ${typeof dateString}, platform: ${Platform.OS}`);

    // Handle undefined or null dates
    if (!dateString) {
      console.log('[FlashcardItem] No date string provided');
      return 'Today'; // Default to today for new cards
    }

    // Try to parse the date string in a more robust way
    let nextReviewDate;
    try {
      // If it's already a Date object
      if (dateString instanceof Date) {
        nextReviewDate = dateString;
      } else if (typeof dateString === 'string') {
        // Try ISO format first (most reliable across platforms)
        nextReviewDate = new Date(dateString);

        // If that fails, try other formats
        if (isNaN(nextReviewDate.getTime())) {
          // Try parsing date parts manually
          const dateParts = dateString.split(/[- :T.]/);
          if (dateParts.length >= 3) {
            // Try YYYY-MM-DD format
            nextReviewDate = new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2])
            );
          }
        }
      } else {
        // If it's a number (timestamp)
        nextReviewDate = new Date(dateString);
      }
    } catch (error) {
      console.error('[FlashcardItem] Error parsing date:', error);
      return 'Today'; // Default to today for parsing errors
    }

    // Check if the date is valid
    if (!nextReviewDate || isNaN(nextReviewDate.getTime())) {
      console.log('[FlashcardItem] Invalid date after parsing');
      return 'Today'; // Default to today for invalid dates
    }

    console.log(`[FlashcardItem] Parsed date: ${nextReviewDate.toISOString()}`);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format dates to YYYY-MM-DD for consistent comparison
    const formatDateForComparison = (date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const todayFormatted = formatDateForComparison(today);
    const tomorrowFormatted = formatDateForComparison(tomorrow);
    const nextReviewFormatted = formatDateForComparison(nextReviewDate);

    // Check if the date is today
    if (nextReviewFormatted === todayFormatted) {
      return 'Today';
    }

    // Check if the date is tomorrow
    if (nextReviewFormatted === tomorrowFormatted) {
      return 'Tomorrow';
    }

    // Calculate days difference
    const diffTime = nextReviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1 && diffDays <= 7) {
      return `In ${diffDays} days`;
    }

    // Return formatted date for dates more than a week away
    // Use a more consistent date formatting approach
    try {
      return `${nextReviewDate.getFullYear()}-${String(nextReviewDate.getMonth() + 1).padStart(2, '0')}-${String(nextReviewDate.getDate()).padStart(2, '0')}`;
    } catch (error) {
      console.error('[FlashcardItem] Error formatting date:', error);
      return nextReviewDate.toString();
    }
  };

  return (
    <View
      style={[
        styles.container,
        Platform.OS === 'web' ? shadowToBoxShadow(shadows.medium) : shadows.medium,
        style,
      ]}
    >
      {/* Decorative elements */}
      <View style={[styles.decorativeCircle, { backgroundColor: learningStatus.color }]} />
      <View style={styles.decorativeLine} />

      <View style={styles.header}>
        {/* Badges removed as requested */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color={getProgressColor()}
            height={8}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            EF: {item.easeFactor.toFixed(2)} | Rep: {item.repetitions}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionText} numberOfLines={2}>
          {item.question || item.front}
        </Text>
        <Text style={styles.answerText} numberOfLines={2}>
          {item.answer || item.back}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Next review:</Text>
          <Text style={styles.dateValue}>{formatNextReviewDate(item.nextReviewDate)}</Text>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Edit"
            onPress={() => onEdit(item.id)}
            variant="primary"
            size="small"
            style={styles.editButton}
          />

          <Button
            title="Delete"
            onPress={() => onDelete(item.id)}
            variant="danger"
            size="small"
            style={styles.deleteButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -50,
    right: -50,
    opacity: 0.1,
  },
  decorativeLine: {
    position: 'absolute',
    width: 3,
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  progressContainer: {
    width: 120,
  },
  progressBar: {
    borderRadius: borderRadius.round,
    marginBottom: spacing.xs,
    height: 8,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: 'right',
  },
  content: {
    marginBottom: spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  questionText: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  answerText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dateLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  dateValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: spacing.xs,
    backgroundColor: colors.primary,
    ...shadows.light,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    ...shadows.light,
  },
});

export default FlashcardItem;

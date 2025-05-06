import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFlashcards } from '../context/FlashcardContext';

// Import our UI components
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import AnimatedGradientCard from '../components/ui/AnimatedGradientCard';
import ActionCard from '../components/ui/ActionCard';
import AppIcon from '../components/ui/AppIcon';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius, shadows } from '../styles/spacing';

// Import utility functions
import { formatUserDisplayName } from '../utils/userUtils';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { flashcards, dueFlashcards, loading, fetchFlashcards } = useFlashcards();

  useEffect(() => {
    fetchFlashcards();
  }, []);

  // Calculate statistics
  const totalFlashcards = flashcards.length;
  const dueCount = dueFlashcards.length;
  const newCount = flashcards.filter(card => card.repetitions === 0).length;

  // Navigate to review screen if there are due cards
  const handleStartReview = () => {
    if (dueCount > 0) {
      navigation.navigate('Review');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your flashcards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Enhanced header with gradient background */}
      <View style={styles.header}>
        <View style={styles.headerGradient} />
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />

        {/* User info section */}
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <AppIcon size={32} style={styles.appIcon} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>
                Welcome, {formatUserDisplayName(user)}!
              </Text>
              <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</Text>
            </View>
          </View>
        </View>

        {/* Logout button in a fixed position */}
        <View style={styles.logoutButtonContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="primary"
            size="small"
            style={styles.logoutButton}
            textStyle={styles.logoutText}
            icon={
              <View style={styles.logoutIcon}>
                <Text style={styles.logoutIconText}>⎋</Text>
              </View>
            }
            iconPosition="right"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Enhanced Statistics Cards */}
        <Text style={styles.sectionTitle}>Your Progress</Text>

        <View style={styles.statsGrid}>
          {/* Row 1: Total and Due */}
          <View style={styles.statsRow}>
            <AnimatedGradientCard
              title="Total Cards"
              value={totalFlashcards}
              gradientColors={[colors.primary, colors.primaryLight]}
              onPress={() => navigation.navigate('Flashcards')}
              style={styles.statCard}
              delay={0}
            />

            <AnimatedGradientCard
              title="Due Today"
              value={dueCount}
              gradientColors={[colors.warning, colors.warningLight]}
              onPress={() => dueCount > 0 && navigation.navigate('Review')}
              style={styles.statCard}
              delay={1}
            />
          </View>

          {/* Row 2: New Cards */}
          <AnimatedGradientCard
            title="New Cards"
            value={newCount}
            gradientColors={[colors.danger, colors.dangerLight]}
            onPress={() => navigation.navigate('CreateFlashcard')}
            style={styles.newStatCard}
            delay={2}
          />
        </View>

        {/* Enhanced Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsContainer}>
          <ActionCard
            title={dueCount > 0 ? "Start Review" : "No Cards Due for Review"}
            subtitle={dueCount > 0 ? `${dueCount} card${dueCount !== 1 ? 's' : ''} waiting for review` : null}
            icon={<Text style={{ fontSize: 24, color: dueCount > 0 ? colors.textLight : colors.textSecondary }}>⟳</Text>}
            variant={dueCount > 0 ? "primary" : "default"}
            onPress={handleStartReview}
            disabled={dueCount === 0}
          />

          <ActionCard
            title="Create New Flashcard"
            subtitle="Add new content to your collection"
            icon={<Text style={{ fontSize: 24, color: colors.textLight }}>+</Text>}
            variant="success"
            onPress={() => navigation.navigate('CreateFlashcard')}
          />

          <ActionCard
            title="View All Flashcards"
            subtitle="Browse and manage your collection"
            icon={<Text style={{ fontSize: 24, color: colors.primary }}>≡</Text>}
            variant="default"
            onPress={() => navigation.navigate('Flashcards')}
          />
        </View>

        {/* Due Cards */}
        {dueCount > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Cards Due Today</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dueCardsContainer}
            >
              {dueFlashcards.slice(0, 5).map((card, index) => (
                <Animated.View
                  key={card.id}
                  style={{
                    opacity: 1,
                    transform: [{ translateY: 0 }],
                  }}
                >
                  <Card
                    style={[styles.dueCardItem, { backgroundColor: index % 2 === 0 ? colors.primaryBackground : colors.warningLight }]}
                    elevation="medium"
                    onPress={() => navigation.navigate('Review')}
                  >
                    <CardContent style={styles.dueCardContent}>
                      <View style={styles.dueCardHeader}>
                        <Text style={styles.dueCardDueText}>Due today</Text>
                      </View>
                      <Text style={styles.dueCardQuestion} numberOfLines={3}>
                        {card.front || card.question}
                      </Text>
                      <Button
                        title="Review Now"
                        onPress={() => navigation.navigate('Review')}
                        variant={index % 2 === 0 ? "primary" : "warning"}
                        size="small"
                        style={styles.reviewButton}
                      />
                    </CardContent>
                  </Card>
                </Animated.View>
              ))}

              {dueCount > 5 && (
                <Animated.View
                  style={{
                    opacity: 1,
                    transform: [{ translateY: 0 }],
                  }}
                >
                  <Card
                    style={styles.viewMoreCard}
                    elevation="light"
                    onPress={() => navigation.navigate('Review')}
                  >
                    <CardContent style={styles.viewMoreCardContent}>
                      <Text style={styles.viewMoreText}>
                        +{dueCount - 5} more
                      </Text>
                      <Button
                        title="View All"
                        onPress={() => navigation.navigate('Review')}
                        variant="outline"
                        size="small"
                        style={styles.viewAllButton}
                      />
                    </CardContent>
                  </Card>
                </Animated.View>
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadows.medium,
    position: 'relative',
    overflow: 'visible', // Changed to visible to allow the logout button to be visible
    minHeight: Platform.OS === 'ios' ? 120 : 100,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
    backgroundColor: colors.primaryDark,
  },
  headerCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primaryLight,
    opacity: 0.3,
    top: -30,
    right: -30,
  },
  headerCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryDark,
    opacity: 0.2,
    bottom: -20,
    left: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.lg : spacing.md,
    position: 'relative',
    zIndex: 1,
    marginRight: 80, // Make room for the logout button
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    ...typography.h3,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  appIcon: {
    margin: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    ...typography.h3,
    color: colors.textLight,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  dateText: {
    ...typography.body2,
    color: colors.textLight,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  logoutButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: spacing.lg,
    zIndex: 10,
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: spacing.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: borderRadius.md,
  },
  logoutText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutIcon: {
    marginLeft: spacing.xs,
  },
  logoutIconText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  statsGrid: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statCard: {
    width: '48%',
    borderRadius: borderRadius.md,
  },
  newStatCard: {
    width: '100%',
    borderRadius: borderRadius.md,
  },
  statCardContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statNumber: {
    ...typography.stat,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actionsContainer: {
    marginBottom: spacing.lg,
  },
  actionCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  activeIcon: {
    color: colors.primary,
  },
  inactiveIcon: {
    color: colors.textTertiary,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    ...typography.subtitle1,
    marginBottom: spacing.xxs,
  },
  activeTitle: {
    color: colors.textPrimary,
  },
  inactiveTitle: {
    color: colors.textTertiary,
  },
  actionSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  dueCardsContainer: {
    paddingRight: spacing.lg,
    paddingBottom: spacing.md,
  },
  dueCardItem: {
    width: 220,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  dueCardContent: {
    padding: spacing.md,
    height: 200,
    justifyContent: 'space-between',
  },
  dueCardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dueCardDueText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  dueCardQuestion: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginVertical: spacing.sm,
  },
  reviewButton: {
    marginTop: spacing.md,
  },
  viewMoreCard: {
    width: 150,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  viewMoreCardContent: {
    padding: spacing.md,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMoreText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  viewAllButton: {
    marginTop: spacing.md,
  },
});

export default HomeScreen;

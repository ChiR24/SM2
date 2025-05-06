import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { useFlashcards } from '../context/FlashcardContext';
import { useFocusEffect } from '@react-navigation/native';

// Import UI components
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import FlashcardItem from '../components/ui/FlashcardItem';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius, shadows, shadowToBoxShadow } from '../styles/spacing';

const FlashcardsScreen = ({ navigation }) => {
  const { flashcards, loading, deleteFlashcard, fetchFlashcards } = useFlashcards();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);

  // Get unique categories from flashcards (excluding empty or 'General' categories)
  const categories = [...new Set(flashcards.map(card => card.category).filter(category => category && category !== 'General'))];

  // Fetch flashcards when component mounts
  useEffect(() => {
    console.log('FlashcardsScreen mounted, fetching flashcards');
    fetchFlashcards();
  }, []);

  // Refresh flashcards when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('FlashcardsScreen focused, refreshing flashcards');
      fetchFlashcards();
      return () => {
        // Cleanup function when screen loses focus
      };
    }, [fetchFlashcards])
  );

  // Filter flashcards based on search query and selected category
  useEffect(() => {
    let filtered = [...flashcards];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        card =>
          card.question.toLowerCase().includes(query) ||
          card.answer.toLowerCase().includes(query)
      );
    }

    // Filter by category if one is selected
    if (selectedCategory) {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }

    setFilteredFlashcards(filtered);
  }, [flashcards, searchQuery, selectedCategory]);

  // Handle flashcard deletion with XMLHttpRequest
  const handleDelete = (id) => {
    if (!id) {
      console.error('Invalid ID provided for deletion');
      Alert.alert('Error', 'Invalid flashcard ID');
      return;
    }

    Alert.alert(
      'Delete Flashcard',
      'Are you sure you want to delete this flashcard?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Use the deleteFlashcard function from context instead of manual XMLHttpRequest
              const result = await deleteFlashcard(id);

              if (result.success) {
                // Show success message
                Alert.alert('Success', 'Flashcard deleted successfully');
              } else {
                // Show error message
                Alert.alert('Error', result.error || 'Failed to delete flashcard');
              }
            } catch (error) {
              console.error('Error deleting flashcard:', error);
              Alert.alert('Error', 'An unexpected error occurred while deleting the flashcard');
            }
          },
        },
      ]
    );
  };

  // Render a flashcard item
  const renderFlashcard = ({ item }) => {
    return (
      <FlashcardItem
        item={{
          ...item,
          question: item.question || item.front,
          answer: item.answer || item.back,
          category: item.category || 'General'
        }}
        onEdit={() => navigation.navigate('EditFlashcard', { id: item.id })}
        onDelete={() => handleDelete(item.id)}
        style={styles.flashcardItem}
      />
    );
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

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search flashcards..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Badge
                label={item}
                variant={selectedCategory === item ? 'primary' : 'outline'}
                size="medium"
                style={[
                  styles.categoryBadge,
                  selectedCategory === item && styles.selectedCategoryBadge
                ]}
                textStyle={selectedCategory === item ?
                  { color: colors.textLight, fontWeight: 'bold' } :
                  { color: colors.textLight, opacity: 0.8 }
                }
                onPress={() => setSelectedCategory(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      </View>

      {/* Flashcards list or empty state */}
      {filteredFlashcards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No flashcards found</Text>
          <Button
            title="Create New Flashcard"
            onPress={() => navigation.navigate('CreateFlashcard')}
            variant="primary"
            size="large"
            style={styles.createButton}
          />
        </View>
      ) : (
        <FlatList
          data={filteredFlashcards}
          keyExtractor={(item) => item.id}
          renderItem={renderFlashcard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating action button */}
      <View style={styles.fabContainer}>
        <Button
          title="+"
          onPress={() => navigation.navigate('CreateFlashcard')}
          variant="primary"
          style={styles.floatingButton}
          textStyle={styles.floatingButtonText}
        />
      </View>
    </View>
  );
};

// Get dimensions for responsive styling if needed
// const { width, height } = Dimensions.get('window');

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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadows.medium,
    position: 'relative',
    overflow: 'hidden',
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    paddingLeft: spacing.lg,
    color: colors.textLight,
    ...typography.body1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoriesContainer: {
    marginTop: spacing.xs,
    position: 'relative',
    zIndex: 1,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  categoryBadge: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedCategoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  flashcardItem: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  createButton: {
    marginTop: spacing.md,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    zIndex: 10,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.success,
    ...Platform.select({
      web: {
        ...shadowToBoxShadow(shadows.heavy),
      },
      default: shadows.heavy,
    }),
  },
  floatingButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: -2, // Adjust vertical alignment of the plus sign
    color: colors.textLight,
  },
});

export default FlashcardsScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useFlashcards } from '../context/FlashcardContext';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius, shadows } from '../styles/spacing';

const CreateFlashcardScreen = ({ navigation }) => {
  // Changed from question/answer to front/back to match backend schema
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createFlashcard, loading } = useFlashcards();

  // Common categories for flashcards
  const commonCategories = [
    'General Knowledge',
    'Science',
    'History',
    'Mathematics',
    'Language',
    'Geography',
    'Technology',
    'Arts',
    'Custom',
  ];

  const handleCreate = async () => {
    // Basic validation
    if (!front || !back || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    console.log('Creating flashcard with data:', { front, back, category });

    try {
      // Create the flashcard data object
      // Map front/back to question/answer for compatibility with the app's current structure
      const flashcardData = {
        question: front, // Map front to question
        answer: back,    // Map back to answer
        category,
      };

      console.log('Calling createFlashcard with:', flashcardData);

      // Call the createFlashcard function from the context
      const result = await createFlashcard(flashcardData);

      console.log('Create flashcard result:', result);

      if (result && result.success) {
        console.log('Flashcard created successfully:', result.flashcard);

        // Show a brief success message
        Alert.alert('Success', 'Flashcard created successfully');

        // Navigate directly to the Flashcards tab using CommonActions
        console.log('Navigating to Flashcards tab using CommonActions');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                state: {
                  routes: [
                    { name: 'Flashcards' }
                  ],
                  index: 1,
                }
              }
            ]
          })
        );
      } else {
        const errorMessage = result?.error || 'Failed to create flashcard';
        console.error('Failed to create flashcard:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } catch (err) {
      console.error('Exception during flashcard creation:', err);

      // Get a more detailed error message
      let errorMessage = 'An unexpected error occurred';
      if (err.message) {
        errorMessage += `: ${err.message}`;
      }

      // Check if it's a network error
      if (err.name === 'NetworkError' || (err.message && err.message.includes('network'))) {
        errorMessage = 'Network error. Please check your connection.';
      }

      // Display the error to the user
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header with gradient background */}
      <View style={styles.header}>
        <View style={styles.headerGradient} />
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Create New Flashcard</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Front (Question)</Text>
            <TextInput
              style={styles.input}
              value={front}
              onChangeText={setFront}
              placeholder="Enter the front side text"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Back (Answer)</Text>
            <TextInput
              style={styles.input}
              value={back}
              onChangeText={setBack}
              placeholder="Enter the back side text"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Enter a category"
            />
          </View>

          <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesLabel}>Common Categories:</Text>
            <View style={styles.categoriesList}>
              {commonCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.selectedCategoryButton,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.selectedCategoryButtonText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {Platform.OS === 'web' ? (
              <button
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#666',
                  padding: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1,
                  width: '100%'
                }}
                onClick={() => {
                  // Navigate back to the flashcards page
                  window.location.href = '/';
                }}
              >
                Cancel
              </button>
            ) : (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  console.log('Cancel button pressed, navigating to Flashcards tab');
                  // Use CommonActions to navigate to the Flashcards tab
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'Main',
                          state: {
                            routes: [
                              { name: 'Flashcards' }
                            ],
                            index: 1,
                          }
                        }
                      ]
                    })
                  );
                }}
                disabled={isSubmitting || loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}

            {Platform.OS === 'web' ? (
              <button
                style={{
                  backgroundColor: '#4A6FA5',
                  color: 'white',
                  padding: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  marginLeft: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1,
                  width: '100%'
                }}
                onClick={async () => {
                  try {
                    if (!front || !back) {
                      console.error('Please fill in both front and back fields');
                      return;
                    }

                    // Get token from localStorage directly
                    const token = localStorage.getItem('token');
                    if (!token) {
                      console.error('No authentication token found. Please log in again.');
                      return;
                    }

                    // Make a direct fetch call
                    const response = await fetch('http://localhost:5000/api/flashcards', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                      },
                      body: JSON.stringify({
                        front: front,
                        back: back,
                        category: category || 'General'
                      })
                    });

                    if (response.ok) {
                      console.log('Flashcard created successfully');
                      // Navigate back to the flashcards page
                      window.location.href = '/';
                    } else {
                      const errorData = await response.json();
                      console.error(`Error: ${errorData.message || 'Failed to create flashcard'}`);
                    }
                  } catch (error) {
                    console.error('Error creating flashcard:', error);
                  }
                }}
              >
                Create
              </button>
            ) : (
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreate}
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Create</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  headerContent: {
    paddingHorizontal: spacing.lg,
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  formContainer: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body1,
    backgroundColor: colors.cardBackground,
    minHeight: 50,
    ...shadows.light,
  },
  categoriesContainer: {
    marginBottom: spacing.lg,
  },
  categoriesLabel: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.round,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  selectedCategoryButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  createButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginLeft: spacing.sm,
    ...shadows.medium,
  },
  createButtonText: {
    ...typography.button,
    color: colors.textLight,
    fontWeight: 'bold',
  },
});

export default CreateFlashcardScreen;

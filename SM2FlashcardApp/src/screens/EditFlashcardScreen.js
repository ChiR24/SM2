import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useFlashcards } from '../context/FlashcardContext';

const EditFlashcardScreen = ({ route, navigation }) => {
  const { id } = route.params;
  // Changed from question/answer to front/back to match backend schema
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { flashcards, updateFlashcard } = useFlashcards();

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

  // Load flashcard data
  useEffect(() => {
    const flashcard = flashcards.find(card => card.id === id);

    if (flashcard) {
      // Map question/answer to front/back
      setFront(flashcard.question);
      setBack(flashcard.answer);
      setCategory(flashcard.category);
      setLoading(false);
    } else {
      Alert.alert('Error', 'Flashcard not found', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [id, flashcards]);

  const handleUpdate = async () => {
    // Basic validation
    if (!front || !back || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map front/back to question/answer for compatibility with the app's current structure
      const result = await updateFlashcard(id, {
        question: front, // Map front to question
        answer: back,    // Map back to answer
        category,
      });

      if (result.success) {
        // Show a brief success message
        Alert.alert('Success', 'Flashcard updated successfully');

        // Navigate directly to the Flashcards tab using CommonActions
        console.log('Navigating to Flashcards tab after update');
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
        Alert.alert('Error', result.error || 'Failed to update flashcard');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Update flashcard error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading flashcard...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Edit Flashcard</Text>

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
                disabled={isSubmitting}
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
                    // Get token from localStorage directly
                    const token = localStorage.getItem('token');
                    if (!token) {
                      console.error('No authentication token found. Please log in again.');
                      return;
                    }

                    // Make a direct fetch call
                    const response = await fetch(`http://localhost:5000/api/flashcards/${id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                      },
                      body: JSON.stringify({
                        front: front,
                        back: back,
                        category: category
                      })
                    });

                    if (response.ok) {
                      console.log('Flashcard updated successfully');
                      // Navigate back to the flashcards page
                      window.location.href = '/';
                    } else {
                      const errorData = await response.json();
                      console.error(`Error: ${errorData.message || 'Failed to update flashcard'}`);
                    }
                  } catch (error) {
                    console.error('Error updating flashcard:', error);
                  }
                }}
              >
                Update
              </button>
            ) : (
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.updateButtonText}>Update</Text>
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A6FA5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#4A6FA5',
  },
  categoryButtonText: {
    color: '#666',
  },
  selectedCategoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditFlashcardScreen;

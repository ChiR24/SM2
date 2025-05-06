/**
 * SM2 Flashcard App - Web Version
 * A web version of the flashcard application using the SM2 spaced repetition algorithm
 */

import React from 'react';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import fix for pointerEvents warning
import './components/FixPointerEventsWarning';

// Import our custom SafeAreaProvider for web
import { SafeAreaProvider } from './components/SafeAreaProviderWeb';

// Import contexts
import { AuthProvider } from './context/AuthContext';
import { FlashcardProvider } from './context/FlashcardContext';
import { ConnectionProvider } from './context/ConnectionContext';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import FlashcardsScreen from './screens/FlashcardsScreen';
import CreateFlashcardScreen from './screens/CreateFlashcardScreen';
import EditFlashcardScreen from './screens/EditFlashcardScreen';
import ReviewScreen from './screens/ReviewScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator for authenticated screens
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A6FA5',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Flashcards"
        component={FlashcardsScreen}
        options={{
          tabBarLabel: 'My Cards',
        }}
      />
      <Tab.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          tabBarLabel: 'Review',
        }}
      />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ConnectionProvider serverUrl="http://localhost:5000">
          <AuthProvider>
            <FlashcardProvider>
              <StatusBar
                barStyle="dark-content"
                backgroundColor="#fff"
              />
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="CreateFlashcard" component={CreateFlashcardScreen} />
                <Stack.Screen name="EditFlashcard" component={EditFlashcardScreen} />
              </Stack.Navigator>
            </FlashcardProvider>
          </AuthProvider>
        </ConnectionProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

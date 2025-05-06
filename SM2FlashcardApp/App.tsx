/**
 * SM2 Flashcard App
 * A mobile flashcard application using the SM2 spaced repetition algorithm
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// Import contexts
import { AuthProvider } from './src/context/AuthContext';
import { FlashcardProvider } from './src/context/FlashcardContext';
import { ConnectionProvider } from './src/context/ConnectionContext';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import CreateFlashcardScreen from './src/screens/CreateFlashcardScreen';
import EditFlashcardScreen from './src/screens/EditFlashcardScreen';
import ReviewScreen from './src/screens/ReviewScreen';

// Use our custom SafeAreaProvider for web
let SafeAreaProvider;
if (Platform.OS === 'web') {
  SafeAreaProvider = require('./src/components/SafeAreaProviderWeb').SafeAreaProvider;
} else {
  SafeAreaProvider = require('react-native-safe-area-context').SafeAreaProvider;
}

// Create navigators
let Stack, Tab;
if (Platform.OS === 'web') {
  // Use createStackNavigator for web
  const { createStackNavigator } = require('@react-navigation/stack');
  const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
  Stack = createStackNavigator();
  Tab = createBottomTabNavigator();
} else {
  // Use createNativeStackNavigator for native
  const { createNativeStackNavigator } = require('@react-navigation/native-stack');
  const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
  Stack = createNativeStackNavigator();
  Tab = createBottomTabNavigator();
}

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

// Get the server URL based on platform
const getServerUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000';
  } else {
    return 'http://localhost:5000';
  }
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const serverUrl = getServerUrl();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ConnectionProvider serverUrl={serverUrl}>
          <AuthProvider>
            <FlashcardProvider>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? '#000' : '#fff'}
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

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StatusBar } from 'react-native';
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

// Import components
import ConnectionStatus from './src/components/ConnectionStatus';

// Create navigators
const Stack = createNativeStackNavigator();
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
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Flashcards"
        component={FlashcardsScreen}
        options={{
          tabBarLabel: 'My Cards',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          tabBarLabel: 'Review',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="refresh" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Simple TabBarIcon component
const TabBarIcon = ({ name, color, size }) => {
  // This is a placeholder. In a real app, you would use an icon library
  // like @expo/vector-icons or react-native-vector-icons
  return null;
};

// Get the server URL based on platform
const getServerUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000';
  } else {
    return 'http://localhost:5000';
  }
};

// Main app component
export default function App() {
  const serverUrl = getServerUrl();

  return (
    <NavigationContainer>
      <ConnectionProvider serverUrl={serverUrl}>
        <AuthProvider>
          <FlashcardProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="#fff"
            />
            <ConnectionStatus />
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
  );
}

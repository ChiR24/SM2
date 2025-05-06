import React from 'react';
import { View } from 'react-native';

// A simple mock implementation of SafeAreaProvider for web
export const SafeAreaProvider = ({ children, style }) => {
  return (
    <View style={[{ flex: 1 }, style]}>
      {children}
    </View>
  );
};

export const SafeAreaView = ({ children, style }) => {
  return (
    <View style={[{ flex: 1 }, style]}>
      {children}
    </View>
  );
};

// Mock other exports from react-native-safe-area-context
export const useSafeAreaInsets = () => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
});

export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight
});

export const SafeAreaInsetsContext = React.createContext({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
});

export const SafeAreaFrameContext = React.createContext({
  x: 0,
  y: 0,
  width: 0,
  height: 0
});

export const initialWindowMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 }
};

// Mock the native modules
export const NativeSafeAreaProvider = {
  initialMetrics: null
};

export const NativeSafeAreaView = {};

export default SafeAreaProvider;

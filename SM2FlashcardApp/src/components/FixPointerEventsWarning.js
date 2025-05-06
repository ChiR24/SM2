import { StyleSheet } from 'react-native';

// This file contains a patch to fix the pointerEvents warning in React Navigation
// It's applied by importing it in App.web.js

// Keep track of warnings to avoid duplicates
const warnedValues = new Set();

// Override the default styles for React Navigation components
if (StyleSheet.setStyleAttributePreprocessor) {
  const originalPreprocessor = StyleSheet.setStyleAttributePreprocessor;

  // Override the preprocessor to handle pointerEvents
  StyleSheet.setStyleAttributePreprocessor = (property, preprocessor) => {
    if (property === 'pointerEvents') {
      return (value) => {
        // Convert pointerEvents prop to style.pointerEvents
        // Only warn once per unique value to reduce console noise
        if (value && !warnedValues.has(value)) {
          warnedValues.add(value);
          console.warn(
            'props.pointerEvents is deprecated. Use style.pointerEvents instead.'
          );
        }
        return value;
      };
    }
    return originalPreprocessor(property, preprocessor);
  };
}

export default {};

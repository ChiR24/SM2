import React from 'react';
import { View, Platform } from 'react-native';

/**
 * A wrapper component that adds a form element on web platform
 * This helps fix accessibility warnings for password fields
 */
const FormWrapper = ({ children, onSubmit, ...props }) => {
  // Only use form on web platform
  if (Platform.OS === 'web') {
    return (
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit();
        }}
        {...props}
      >
        {children}
      </form>
    );
  }
  
  // On native platforms, use a regular View
  return <View {...props}>{children}</View>;
};

export default FormWrapper;

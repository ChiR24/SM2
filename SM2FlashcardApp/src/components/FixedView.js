import React from 'react';
import { View, Platform } from 'react-native';
import { fixPointerEvents } from '../utils/styleUtils';

/**
 * A wrapper around View that fixes common web-specific issues
 * - Fixes pointerEvents prop by moving it to style
 */
const FixedView = (props) => {
  // Only apply fixes on web platform
  if (Platform.OS === 'web') {
    const fixedProps = fixPointerEvents(props);
    return <View {...fixedProps} />;
  }
  
  // On native platforms, use the original View
  return <View {...props} />;
};

export default FixedView;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

/**
 * AppIcon component for the SM2 Flashcard App
 * This is a non-SVG implementation that uses regular React Native components
 */
const AppIcon = ({ size = 64, style = {} }) => {
  // Calculate sizes based on the requested size
  const fontSize = Math.max(12, Math.floor(size * 0.3));
  const borderRadius = Math.floor(size * 0.25);

  return (
    <View style={[
      styles.container,
      {
        width: size,
        height: size,
        borderRadius: borderRadius,
        backgroundColor: colors.primary
      },
      style
    ]}>
      <View style={[
        styles.innerCircle,
        {
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: size * 0.4,
        }
      ]}>
        <Text style={[
          styles.text,
          { fontSize: fontSize }
        ]}>
          SM2
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
});

export default AppIcon;

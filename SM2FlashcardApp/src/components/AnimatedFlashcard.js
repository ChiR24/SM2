import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import { convertShadowToBoxShadow } from '../utils/styleUtils';

const { width } = Dimensions.get('window');

const AnimatedFlashcard = ({
  front,
  back,
  category,
  isFlipped,
  onFlip,
  style,
}) => {
  // Animation values
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Interpolate for the front and back animations
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Scale animation for hover effect
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  // Animated styles
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  // Handle flip animation
  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 180;
    
    Animated.spring(flipAnimation, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    
    if (onFlip) {
      onFlip();
    }
  };

  // Handle hover effect (for web)
  const handleHoverIn = () => {
    if (Platform.OS === 'web') {
      Animated.spring(scaleAnimation, {
        toValue: 1.05,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleHoverOut = () => {
    if (Platform.OS === 'web') {
      Animated.spring(scaleAnimation, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const containerStyle = {
    transform: [{ scale: scaleAnimation }],
    ...style,
  };

  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <Animated.View 
        style={[styles.container, containerStyle]}
        onMouseEnter={handleHoverIn}
        onMouseLeave={handleHoverOut}
      >
        <Animated.View
          style={[styles.card, styles.cardFront, frontAnimatedStyle]}
        >
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{category || 'General'}</Text>
          </View>
          <Text style={styles.contentText}>{front}</Text>
          <Text style={styles.tapText}>Tap to flip</Text>
        </Animated.View>
        
        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
        >
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{category || 'General'}</Text>
          </View>
          <Text style={styles.contentText}>{back}</Text>
          <Text style={styles.tapText}>Tap to flip</Text>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    perspective: 1000,
  },
  card: Platform.OS === 'web'
    ? convertShadowToBoxShadow({
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      })
    : {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      },
  cardFront: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    borderLeftColor: '#4A6FA5',
  },
  cardBack: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 5,
    borderLeftColor: '#FFD700',
    transform: [{ rotateY: '180deg' }],
  },
  categoryContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A6FA5',
  },
  contentText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    maxWidth: '90%',
  },
  tapText: {
    position: 'absolute',
    bottom: 15,
    fontSize: 12,
    color: '#999',
  },
});

export default AnimatedFlashcard;

/**
 * Input component for the SM2 Flashcard App
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing, borderRadius } from '../../styles/spacing';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  error = '',
  disabled = false,
  style = {},
  inputStyle = {},
  labelStyle = {},
  leftIcon = null,
  rightIcon = null,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedLabelPosition] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedLabelPosition, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedLabelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelPosition = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -spacing.lg],
  });

  const labelSize = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [typography.body1.fontSize, typography.caption.fontSize],
  });

  const labelColor = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textSecondary, colors.primary],
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              transform: [{ translateY: labelPosition }],
              fontSize: labelSize,
              color: isFocused ? colors.primary : colors.textSecondary,
              color: error ? colors.danger : labelColor,
            },
            labelStyle,
          ]}
        >
          {label}
        </Animated.Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            isFocused && styles.focusedInput,
            error && styles.errorInput,
            disabled && styles.disabledInput,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={isFocused || !label ? placeholder : ''}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: spacing.sm,
    top: spacing.md,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.xs,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.body1.fontSize,
    color: colors.textPrimary,
    backgroundColor: colors.cardBackground,
  },
  multilineInput: {
    height: 100,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  focusedInput: {
    borderColor: colors.primary,
  },
  errorInput: {
    borderColor: colors.danger,
  },
  disabledInput: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIcon: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: spacing.md,
    zIndex: 1,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});

export default Input;

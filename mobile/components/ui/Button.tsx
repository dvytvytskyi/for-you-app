import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';

export type ButtonVariant = 'primary' | 'outline' | 'dark';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const getButtonStyles = () => {
    const baseStyle = [styles.base];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    } else {
      baseStyle.push(styles.fixedWidth);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
      return baseStyle;
    }

    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'dark':
        baseStyle.push(styles.dark);
        break;
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (disabled) return styles.textDisabled;
    if (variant === 'primary') return styles.textPrimary;
    return styles.textWhite;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyles(),
        { opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#010312' : '#FFFFFF'} />
      ) : (
        <Text style={[styles.text, getTextColor()]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedWidth: {
    width: 312,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: '#FFFFFF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  dark: {
    backgroundColor: '#010312',
    borderRadius: 6,
  },
  disabled: {
    backgroundColor: '#D1D5DB',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#010312',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textDisabled: {
    color: '#6B7280',
  },
});


import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'dark' | 'light';
}

export default function Toggle({
  label,
  value,
  onValueChange,
  disabled = false,
  fullWidth = false,
  variant = 'dark',
}: ToggleProps) {
  const textColor = variant === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666666';
  
  return (
    <View
      style={{
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: fullWidth ? '100%' : 312,
      }}
    >
      <Text style={{ fontSize: 16, color: textColor, fontWeight: '400' }}>
        {label}
      </Text>

      <Pressable
        onPress={() => !disabled && onValueChange(!value)}
        disabled={disabled}
        style={{
          width: 51,
          height: 31,
          borderRadius: 16,
          backgroundColor: value ? '#010312' : '#4A4A4A',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          padding: 2,
        }}
      >
        <View
          style={{
            width: 27,
            height: 27,
            borderRadius: 14,
            backgroundColor: '#FFFFFF',
            marginLeft: value ? 'auto' : 0,
            marginRight: value ? 0 : 'auto',
          }}
        />
      </Pressable>
    </View>
  );
}


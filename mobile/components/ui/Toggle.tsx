import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Toggle({
  label,
  value,
  onValueChange,
  disabled = false,
  fullWidth = false,
}: ToggleProps) {
  return (
    <View
      style={{
        height: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: fullWidth ? '100%' : 312,
      }}
    >
      <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '500' }}>
        {label}
      </Text>

      <Pressable
        onPress={() => !disabled && onValueChange(!value)}
        disabled={disabled}
        style={{
          width: 48,
          height: 28,
          borderRadius: 14,
          backgroundColor: value ? '#FFFFFF' : '#2A2A2A',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#010312',
            marginLeft: value ? 'auto' : 4,
            marginRight: value ? 4 : 'auto',
          }}
        />
      </Pressable>
    </View>
  );
}


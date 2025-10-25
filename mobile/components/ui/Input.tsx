import React, { useState } from 'react';
import { TextInput, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password';
  error?: string;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  fullWidth?: boolean;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  type = 'text',
  error,
  disabled = false,
  autoCapitalize = 'none',
  fullWidth = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  const isPassword = type === 'password';
  const secureTextEntry = isPassword && !showPassword;

  return (
    <View style={[styles.container, fullWidth ? styles.fullWidth : styles.fixedWidth]}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={getKeyboardType()}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
        />
        
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#64748B"
            />
          </Pressable>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Base container
  },
  fixedWidth: {
    width: 312,
  },
  fullWidth: {
    width: '100%',
  },
  inputContainer: {
    height: 48,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#010312',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});


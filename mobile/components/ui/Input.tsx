import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { TextInput, View, Text, Pressable, StyleSheet, ReturnKeyTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password';
  error?: string;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  fullWidth?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
  blurOnSubmit?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholderColor?: string;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  error,
  disabled = false,
  autoCapitalize = 'none',
  fullWidth = false,
  onSubmitEditing,
  returnKeyType = 'next',
  blurOnSubmit = false,
  keyboardType,
  secureTextEntry: secureTextEntryProp,
  rightIcon,
  inputBackgroundColor,
  inputBorderColor,
  inputTextColor,
  inputPlaceholderColor,
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { theme } = useTheme();

  // Expose input methods to parent ref
  useImperativeHandle(ref, () => inputRef.current as TextInput);

  const getKeyboardType = () => {
    if (keyboardType) return keyboardType;
    switch (type) {
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const isPassword = type === 'password';
  // Use explicit secureTextEntry prop if provided, otherwise fallback to password type logic
  const secureTextEntry = secureTextEntryProp !== undefined 
    ? secureTextEntryProp 
    : (isPassword && !showPassword);

  return (
    <View style={[styles.container, fullWidth ? styles.fullWidth : styles.fixedWidth]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}
      
      <Pressable 
        style={[
          styles.inputContainer, 
          { 
            backgroundColor: inputBackgroundColor || theme.inputBackground, 
            borderColor: error ? theme.error : (inputBorderColor || theme.inputBorder)
          },
          error && styles.inputError
        ]}
        onPress={handleContainerPress}
        disabled={disabled}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: inputTextColor || theme.text }]}
          placeholder={placeholder || label}
          placeholderTextColor={inputPlaceholderColor || theme.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={getKeyboardType()}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
        />
        
        {/* Show custom rightIcon if provided, otherwise show default password toggle for password type */}
        {rightIcon ? (
          <View style={styles.iconWrapper}>{rightIcon}</View>
        ) : isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconWrapper}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.textTertiary}
            />
          </Pressable>
        )}
      </Pressable>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;

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
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputError: {
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 24,
    minWidth: 24,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});


import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface SearchBarProps extends React.ComponentProps<typeof TextInput> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  inputRef?: React.RefObject<TextInput>;
  backgroundColor?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Find property', onFocus, onBlur, autoFocus, inputRef, backgroundColor, ...props }: SearchBarProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || theme.card, borderColor: backgroundColor ? backgroundColor : theme.border }]}>
      <Ionicons name="search" size={20} color={theme.textTertiary} style={styles.icon} />
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: theme.text, height: '100%' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888899"
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor, borderColor applied dynamically
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
    // color applied dynamically
  },
});


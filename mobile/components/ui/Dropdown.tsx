import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Dropdown({
  placeholder,
  value,
  onValueChange,
  options,
  error,
  disabled = false,
  fullWidth = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={[fullWidth ? styles.fullWidth : styles.fixedWidth]}>
      <Pressable
        style={[
          styles.dropdown,
          error && styles.dropdownError,
          disabled && styles.dropdownDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dropdownText,
            selectedOption ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder,
          ]}
        >
          {displayText}
        </Text>
        
        <Ionicons
          name="chevron-down-outline"
          size={20}
          color="#64748B"
        />
      </Pressable>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Modal for options */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalInner}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>
                  {placeholder}
                </Text>
              </View>

              {/* Options List */}
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.optionItem,
                      item.value === value && styles.optionItemSelected,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        item.value === value && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />

              {/* Cancel Button */}
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.cancelButtonText}>
                  Скасувати
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fixedWidth: {
    width: 312,
  },
  fullWidth: {
    width: '100%',
  },
  dropdown: {
    height: 48,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f4f4f4',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  dropdownError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownTextSelected: {
    color: '#010312',
  },
  dropdownTextPlaceholder: {
    color: '#94A3B8',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: 384,
    width: 320,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  optionTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});


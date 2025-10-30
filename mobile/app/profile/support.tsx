import { View, Text, StyleSheet, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Input } from '@/components/ui';
import { useTheme } from '@/utils/theme';

type SupportCategory = 'technical' | 'account' | 'billing' | 'property' | 'other';

interface CategoryOption {
  value: SupportCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const categories: CategoryOption[] = [
  { value: 'technical', label: 'Technical Issue', icon: 'bug-outline' },
  { value: 'account', label: 'Account Problem', icon: 'person-outline' },
  { value: 'billing', label: 'Billing Question', icon: 'card-outline' },
  { value: 'property', label: 'Property Inquiry', icon: 'home-outline' },
  { value: 'other', label: 'Other', icon: 'help-circle-outline' },
];

interface AttachedFile {
  name: string;
  size: number;
  uri: string;
  mimeType?: string;
}

export default function SupportScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  
  const [errors, setErrors] = useState({
    category: '',
    subject: '',
    message: '',
  });
  
  const hasData = selectedCategory || subject || message || attachedFiles.length > 0;
  
  const handleBack = () => {
    if (hasData) {
      Alert.alert(
        'Discard Message?',
        'Are you sure you want to leave? Your message will not be saved.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };
  
  const handleAttachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        // Check file size (max 10MB)
        if (file.size && file.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB');
          return;
        }
        
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          size: file.size || 0,
          uri: file.uri,
          mimeType: file.mimeType,
        }]);
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Error', 'Failed to attach file. Please try again.');
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  const handleSubmit = () => {
    // Validate
    const newErrors = {
      category: '',
      subject: '',
      message: '',
    };
    
    let hasErrors = false;
    
    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
      hasErrors = true;
    }
    
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
      hasErrors = true;
    }
    
    if (!message.trim()) {
      newErrors.message = 'Message is required';
      hasErrors = true;
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    // Submit logic here (API call)
    Alert.alert(
      'Support Request Sent',
      'Thank you for contacting us. We will respond to your request within 24 hours.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Help & Support</Text>
        
        <View style={styles.backButton} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Section */}
          <View style={[styles.infoSection, { backgroundColor: theme.backgroundSecondary }]}>
            <Ionicons name="information-circle-outline" size={20} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              We're here to help! Describe your issue and we'll get back to you within 24 hours.
            </Text>
          </View>
          
          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Category *</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const isSelected = selectedCategory === category.value;
                return (
                  <Pressable
                    key={category.value}
                    style={({ pressed }) => [
                      styles.categoryItem,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                      isSelected && styles.categoryItemSelected,
                      { opacity: pressed ? 0.7 : 1 }
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.value);
                      if (errors.category) {
                        setErrors(prev => ({ ...prev, category: '' }));
                      }
                    }}
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={24} 
                      color={isSelected ? theme.primary : theme.textSecondary} 
                    />
                    <Text style={[
                      styles.categoryLabel,
                      { color: isSelected ? theme.primary : theme.textSecondary }
                    ]}>
                      {category.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>
          
          {/* Subject */}
          <View style={styles.section}>
            <Input
              label="Subject *"
              value={subject}
              onChangeText={(text) => {
                setSubject(text);
                if (errors.subject) {
                  setErrors(prev => ({ ...prev, subject: '' }));
                }
              }}
              error={errors.subject}
              placeholder="Brief description of your issue"
              fullWidth
            />
          </View>
          
          {/* Message */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Message *</Text>
            <View style={[
              styles.textAreaContainer, 
              { 
                backgroundColor: theme.inputBackground, 
                borderColor: errors.message ? theme.error : theme.inputBorder 
              },
              errors.message && styles.textAreaError
            ]}>
              <TextInput
                style={[styles.textArea, { color: theme.text }]}
                value={message}
                onChangeText={(text) => {
                  setMessage(text);
                  if (errors.message) {
                    setErrors(prev => ({ ...prev, message: '' }));
                  }
                }}
                placeholder="Please describe your issue in detail..."
                placeholderTextColor={theme.inputPlaceholder}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            {errors.message && (
              <Text style={styles.errorText}>{errors.message}</Text>
            )}
          </View>
          
          {/* Attachments */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Attachments (Optional)</Text>
            <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
              You can attach screenshots or documents (max 10MB each)
            </Text>
            
            {attachedFiles.length > 0 && (
              <View style={styles.filesList}>
                {attachedFiles.map((file, index) => (
                  <View key={index} style={[styles.fileItem, { backgroundColor: theme.primaryLight }]}>
                    <View style={[styles.fileIcon, { backgroundColor: theme.card }]}>
                      <Ionicons name="document-outline" size={20} color={theme.primary} />
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={[styles.fileSize, { color: theme.textSecondary }]}>
                        {formatFileSize(file.size)}
                      </Text>
                    </View>
                    <Pressable
                      style={({ pressed }) => [
                        styles.removeButton,
                        { opacity: pressed ? 0.6 : 1 }
                      ]}
                      onPress={() => handleRemoveFile(index)}
                    >
                      <Ionicons name="close-circle" size={20} color="#FF3B30" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
            
            <Pressable
              style={({ pressed }) => [
                styles.attachButton,
                { 
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.primary,
                  opacity: pressed ? 0.7 : 1 
                }
              ]}
              onPress={handleAttachFile}
            >
              <Ionicons name="attach-outline" size={20} color={theme.primary} />
              <Text style={[styles.attachButtonText, { color: theme.primary }]}>Attach File</Text>
            </Pressable>
          </View>
          
          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                { backgroundColor: theme.primary },
                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Send Request</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 12,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  categoryItemSelected: {
    borderWidth: 2,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAreaContainer: {
    minHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderRadius: 8,
  },
  textAreaError: {
    borderWidth: 1,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  filesList: {
    gap: 8,
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    gap: 8,
  },
  attachButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});


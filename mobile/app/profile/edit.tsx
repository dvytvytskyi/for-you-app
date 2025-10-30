import { View, Text, StyleSheet, ScrollView, Alert, Image, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/ui';
import { useTheme } from '@/utils/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Initial data (from API/storage)
  const initialData = {
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+971 50 123 4567',
    licenseNumber: 'BRK-12345',
  };
  
  // Current form data
  const [formData, setFormData] = useState(initialData);
  
  // Validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  // Check if data has changed
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleChangeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };
  
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };
  
  const handleSave = () => {
    if (!hasChanges) return;
    
    // Validate all fields
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };
    
    let hasErrors = false;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      hasErrors = true;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      hasErrors = true;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      hasErrors = true;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      hasErrors = true;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    // Save logic here (API call)
    Alert.alert('Success', 'Profile updated successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
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
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
        
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
          {/* Avatar Section */}
          <View style={[styles.avatarSection, { borderBottomColor: theme.border }]}>
            {formData.avatar ? (
              <Image 
                source={{ uri: formData.avatar }} 
                style={[styles.avatar, { borderColor: theme.border }]}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
                <Ionicons name="person" size={40} color={theme.textTertiary} />
              </View>
            )}
            
            <View style={styles.avatarActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  { 
                    borderColor: theme.border, 
                    backgroundColor: theme.card,
                    opacity: pressed ? 0.6 : 1 
                  }
                ]}
                onPress={handleChangeAvatar}
              >
                <Text style={[styles.actionButtonText, { color: theme.text }]}>Change</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  { 
                    borderColor: theme.border, 
                    backgroundColor: theme.card,
                    opacity: pressed ? 0.6 : 1 
                  }
                ]}
                onPress={() => Alert.alert('Delete Photo', 'Are you sure you want to delete your profile photo?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => {
                    setFormData(prev => ({ ...prev, avatar: '' }));
                  }}
                ])}
              >
                <Text style={styles.actionButtonTextDelete}>Delete</Text>
              </Pressable>
            </View>
          </View>
          
          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => handleFieldChange('firstName', text)}
              error={errors.firstName}
              autoCapitalize="words"
              fullWidth
            />
            
            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => handleFieldChange('lastName', text)}
              error={errors.lastName}
              autoCapitalize="words"
              fullWidth
            />
            
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleFieldChange('email', text)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              fullWidth
            />
            
            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleFieldChange('phone', text)}
              error={errors.phone}
              keyboardType="phone-pad"
              fullWidth
            />
            
            <Input
              label="License Number (Optional)"
              value={formData.licenseNumber}
              onChangeText={(text) => handleFieldChange('licenseNumber', text)}
              fullWidth
            />
          </View>
          
          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: hasChanges ? theme.primary : theme.border },
                { opacity: pressed && hasChanges ? 0.9 : 1, transform: [{ scale: pressed && hasChanges ? 0.98 : 1 }] }
              ]}
              onPress={handleSave}
              disabled={!hasChanges}
            >
              <Text style={[styles.saveButtonText, { color: hasChanges ? '#FFFFFF' : theme.textTertiary }]}>Save</Text>
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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomWidth: 0.5,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 0.5,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActions: {
    flex: 1,
    marginLeft: 16,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonTextDelete: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF3B30',
  },
  formContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});


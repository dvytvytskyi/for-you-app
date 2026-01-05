import { View, Text, StyleSheet, ScrollView, Alert, Image, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useAuthStore } from '@/store/authStore';
import { ActivityIndicator } from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const authUser = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Initial data from authStore (real user data)
  const getInitialData = () => {
    if (!authUser) {
      return {
        avatar: null as string | null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
      };
    }

    return {
      avatar: authUser.avatar || null,
      firstName: authUser.firstName || '',
      lastName: authUser.lastName || '',
      email: authUser.email || '',
      phone: authUser.phone || '',
      licenseNumber: authUser.licenseNumber || '',
    };
  };

  // Current form data
  const [formData, setFormData] = useState(getInitialData());

  // Update form data when authUser changes
  useEffect(() => {
    if (authUser) {
      setFormData({
        avatar: authUser.avatar || null,
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        licenseNumber: authUser.licenseNumber || '',
      });
    }
  }, [authUser]);

  // Initial data for comparison
  const initialData = getInitialData();

  // Validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Check if data has changed
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  // Redirect if no user
  useEffect(() => {
    if (!authUser) {
      router.replace('/profile');
    }
  }, [authUser, router]);

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

  const handleSave = async () => {
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

    // Save profile via API
    try {
      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        licenseNumber: formData.licenseNumber?.trim() || undefined,
        avatar: formData.avatar || undefined,
      });

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response);

      let errorMessage = 'Failed to update profile. Please try again.';

      if (error.response?.status === 404) {
        errorMessage = 'Profile update is currently unavailable. The feature is being deployed. Please try again later or contact support.';
      } else if (error.response?.status === 409) {
        errorMessage = error.response?.data?.message || 'A user with this email or phone number already exists.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized. Please log in again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    }
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
              <View style={[styles.avatarPlaceholder, { borderColor: theme.border, backgroundColor: theme.primary }]}>
                <Text style={{ fontSize: 36, fontWeight: '600', color: '#FFFFFF' }}>
                  {(formData.firstName[0] || '').toUpperCase()}{(formData.lastName[0] || '').toUpperCase()}
                </Text>
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
                  {
                    text: 'Delete', style: 'destructive', onPress: () => {
                      setFormData(prev => ({ ...prev, avatar: '' }));
                    }
                  }
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
                { backgroundColor: hasChanges && !isLoading ? theme.primary : theme.border },
                { opacity: (pressed && hasChanges && !isLoading) ? 0.9 : 1, transform: [{ scale: (pressed && hasChanges && !isLoading) ? 0.98 : 1 }] }
              ]}
              onPress={handleSave}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[styles.saveButtonText, { color: hasChanges ? '#FFFFFF' : theme.textTertiary }]}>Save</Text>
              )}
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
    paddingTop: 12,
    paddingBottom: 32,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 0.5,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
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


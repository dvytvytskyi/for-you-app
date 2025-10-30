import { View, Text, StyleSheet, ScrollView, Alert, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui';
import { useTheme } from '@/utils/theme';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Form data
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Show/hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Check if form has data
  const hasData = formData.currentPassword || formData.newPassword || formData.confirmPassword;
  
  const validatePasswordStrength = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  };
  
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleBack = () => {
    if (hasData) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to leave? Your changes will not be saved.',
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
    if (!hasData) return;
    
    // Validate all fields
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    
    let hasErrors = false;
    
    // Validate current password
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
      hasErrors = true;
    }
    
    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      hasErrors = true;
    } else if (!validatePasswordStrength(formData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      hasErrors = true;
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
      hasErrors = true;
    }
    
    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
      hasErrors = true;
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    // Save logic here (API call)
    Alert.alert('Success', 'Password changed successfully', [
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
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Change Password</Text>
        
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
              Your password must be at least 8 characters long and include uppercase, lowercase, and numbers.
            </Text>
          </View>
          
          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Input
              label="Current Password"
              value={formData.currentPassword}
              onChangeText={(text) => handleFieldChange('currentPassword', text)}
              error={errors.currentPassword}
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
              fullWidth
              rightIcon={
                <Pressable 
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={theme.textTertiary} 
                  />
                </Pressable>
              }
            />
            
            <Input
              label="New Password"
              value={formData.newPassword}
              onChangeText={(text) => handleFieldChange('newPassword', text)}
              error={errors.newPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              fullWidth
              rightIcon={
                <Pressable 
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={theme.textTertiary} 
                  />
                </Pressable>
              }
            />
            
            <Input
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleFieldChange('confirmPassword', text)}
              error={errors.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              fullWidth
              rightIcon={
                <Pressable 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={theme.textTertiary} 
                  />
                </Pressable>
              }
            />
          </View>
          
          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: hasData ? theme.primary : theme.border },
                { opacity: pressed && hasData ? 0.9 : 1, transform: [{ scale: pressed && hasData ? 0.98 : 1 }] }
              ]}
              onPress={handleSave}
              disabled={!hasData}
            >
              <Text style={[styles.saveButtonText, { color: hasData ? '#FFFFFF' : theme.textTertiary }]}>Save</Text>
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
  formContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  eyeButton: {
    padding: 4,
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


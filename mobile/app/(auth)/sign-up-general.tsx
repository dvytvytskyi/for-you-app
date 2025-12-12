import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Input, Button } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpGeneralScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Error states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Clear error when user starts typing
  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (firstNameError) setFirstNameError('');
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (lastNameError) setLastNameError('');
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    if (phoneError) setPhoneError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Очищаємо помилку при введенні
    if (passwordError) {
      setPasswordError('');
    }
    // Опціонально: валідація в реальному часі (якщо хочете)
    // Але не показуємо помилку поки користувач не натисне Continue
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    // Перевірка довжини
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    
    // Перевірка великої літери (capital letter)
    // Використовуємо більш надійну перевірку
    const hasUpperCase = /[A-ZА-ЯЁ]/.test(password);
    if (!hasUpperCase) {
      console.log('Password validation: No uppercase letter found in:', password);
      return { isValid: false, error: 'Password must include at least 1 capital letter (A-Z)' };
    }
    
    // Перевірка символу (розширений список символів)
    // Включаємо більше символів: !@#$%^&*()_+-=[]{}|;:,.<>?/~`
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password);
    if (!hasSymbol) {
      console.log('Password validation: No symbol found in:', password);
      return { isValid: false, error: 'Password must include at least 1 symbol (!@#$%^&* etc.)' };
    }
    
    console.log('Password validation: PASSED for:', password);
    return { isValid: true };
  };

  const handleContinue = () => {
    let hasError = false;

    // Reset all errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');

    // Validate First Name
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasError = true;
    }

    // Validate Last Name
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      hasError = true;
    }

    // Validate Email
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    // Validate Phone
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      hasError = true;
    } else if (phone.trim().length < 10) {
      setPhoneError('Phone number must be at least 10 characters');
      hasError = true;
    }

    // Validate Password
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else {
      // Детальна валідація з логуванням
      console.log('🔍 Validating password:', password);
      console.log('🔍 Password length:', password.length);
      console.log('🔍 Has uppercase:', /[A-ZА-ЯЁ]/.test(password));
      console.log('🔍 Has symbol:', /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password));
      
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        console.log('❌ Password validation failed:', passwordValidation.error);
        setPasswordError(passwordValidation.error || 'Invalid password');
        hasError = true;
      } else {
        console.log('✅ Password validation passed');
      }
    }

    if (!hasError) {
      // Передаємо дані через router params
      router.push({
        pathname: '/(auth)/sign-up-details',
        params: {
          firstName,
          lastName,
          email,
          phone,
          password,
        },
      });
    }
  };

  // Enable swipe back gesture
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: true,
    });
  }, [navigation]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(auth)/intro');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Back Button */}
      <Pressable onPress={handleGoBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </Pressable>

      {/* Dark Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>
        <Text style={styles.description}>
          Get updates, property access, Dubai data and more info on your real estate journey
        </Text>
      </View>

      {/* White Form Section */}
      <KeyboardAvoidingView 
        style={styles.formSection}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Input
              placeholder="First Name"
              value={firstName}
              onChangeText={handleFirstNameChange}
              error={firstNameError}
              fullWidth
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
              inputBackgroundColor="#FFFFFF"
              inputBorderColor="#DFDFE0"
              inputTextColor="#010312"
              inputPlaceholderColor="#94A3B8"
            />
            
            <Input
              ref={lastNameRef}
              placeholder="Last Name"
              value={lastName}
              onChangeText={handleLastNameChange}
              error={lastNameError}
              fullWidth
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
              inputBackgroundColor="#FFFFFF"
              inputBorderColor="#DFDFE0"
              inputTextColor="#010312"
              inputPlaceholderColor="#94A3B8"
            />
            
            <Input
              ref={emailRef}
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              error={emailError}
              type="email"
              autoCapitalize="none"
              fullWidth
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
              blurOnSubmit={false}
              inputBackgroundColor="#FFFFFF"
              inputBorderColor="#DFDFE0"
              inputTextColor="#010312"
              inputPlaceholderColor="#94A3B8"
            />
            
            <Input
              ref={phoneRef}
              placeholder="Phone Number"
              value={phone}
              onChangeText={handlePhoneChange}
              error={phoneError}
              type="text"
              keyboardType="phone-pad"
              fullWidth
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              inputBackgroundColor="#FFFFFF"
              inputBorderColor="#DFDFE0"
              inputTextColor="#010312"
              inputPlaceholderColor="#94A3B8"
            />
            
            <Input
              ref={passwordRef}
              placeholder="Password"
              value={password}
              onChangeText={handlePasswordChange}
              error={passwordError}
              type="password"
              fullWidth
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              inputBackgroundColor="#FFFFFF"
              inputBorderColor="#DFDFE0"
              inputTextColor="#010312"
              inputPlaceholderColor="#94A3B8"
            />

            <View style={styles.passwordRequirementsContainer}>
              <Text style={styles.passwordRequirementsTitle}>Password requirements:</Text>
              <View style={styles.passwordRequirementItem}>
                <Ionicons 
                  name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={password.length >= 8 ? "#4CAF50" : "#999999"} 
                />
                <Text style={[styles.passwordRequirementText, password.length >= 8 && styles.passwordRequirementMet]}>
                  At least 8 characters ({password.length}/8)
                </Text>
              </View>
              <View style={styles.passwordRequirementItem}>
                <Ionicons 
                  name={/[A-ZА-ЯЁ]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[A-ZА-ЯЁ]/.test(password) ? "#4CAF50" : "#999999"} 
                />
                <Text style={[styles.passwordRequirementText, /[A-ZА-ЯЁ]/.test(password) && styles.passwordRequirementMet]}>
                  At least 1 capital letter (A-Z)
                </Text>
              </View>
              <View style={styles.passwordRequirementItem}>
                <Ionicons 
                  name={/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password) ? "#4CAF50" : "#999999"} 
                />
                <Text style={[styles.passwordRequirementText, /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password) && styles.passwordRequirementMet]}>
                  At least 1 symbol (!@#$% etc.)
                </Text>
              </View>
            </View>

            <Text style={styles.privacyText}>
              When you click 'Create account', you agree to our{' '}
              <Text style={styles.privacyLink}>Privacy Policy</Text>
            </Text>

            <Button
              title="Continue"
              variant="dark"
              fullWidth
              onPress={handleContinue}
            />

            <Text style={styles.disclaimer}>
              By agreeing to the above terms, you are consenting that your personal information will be collected, stored, and processed in the United States and the European Union on behalf of Sporify Properties, Inc.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010312',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSection: {
    backgroundColor: '#010312',
    paddingHorizontal: 16,
    paddingTop: 70,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 12,
    letterSpacing: -0.9,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'left',
    lineHeight: 20,
    letterSpacing: 0,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  passwordRequirementsContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  passwordRequirementsTitle: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordRequirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  passwordRequirementText: {
    fontSize: 12,
    color: '#999999',
  },
  passwordRequirementMet: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  privacyText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'left',
    marginTop: 8,
  },
  privacyLink: {
    textDecorationLine: 'underline',
    color: '#999999',
    fontSize: 12,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'left',
    marginTop: 12,
    marginBottom: 48,
  },
  
});


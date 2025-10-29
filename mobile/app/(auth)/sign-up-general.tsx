import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Input, Button } from '@/components/ui';

export default function SignUpGeneralScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
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

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must include at least 1 capital letter' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must include at least 1 symbol' };
    }
    return { isValid: true };
  };

  const handleContinue = () => {
    let hasError = false;

    // Reset all errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
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

    // Validate Password
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordError(passwordValidation.error || 'Invalid password');
        hasError = true;
      }
    }

    if (!hasError) {
      router.push('/(auth)/sign-up-details');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
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
            />

            <Text style={styles.passwordRequirements}>
              Password must be at least 8 character long and include 1 capital letter and 1 symbol
            </Text>

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
  topSection: {
    backgroundColor: '#010312',
    paddingHorizontal: 16,
    paddingTop: 20,
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
  passwordRequirements: {
    fontSize: 12,
    color: '#999999',
    marginTop: 0,
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


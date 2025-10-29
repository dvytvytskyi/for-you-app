import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Input, Button } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordRef = useRef<TextInput>(null);

  // Clear error when user starts typing
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

  const handleSignIn = () => {
    let hasError = false;

    // Reset all errors
    setEmailError('');
    setPasswordError('');

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
    }

    if (!hasError) {
      // TODO: Implement sign in logic with backend
      console.log('Sign in', { email, password });
      // After successful login, redirect to tabs
      router.replace('/(tabs)/home');
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot password');
  };

  const handleSignUp = () => {
    router.push('/(auth)/intro');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Dark Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.title}>SIGN IN TO YOUR ACCOUNT</Text>
        <Text style={styles.description}>
          Welcome back! Sign in to continue your real estate journey
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
              onSubmitEditing={handleSignIn}
            />

            <Pressable onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>

            <Button
              title="Sign in"
              variant="dark"
              fullWidth
              onPress={handleSignIn}
            />

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <Pressable onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </Pressable>
            </View>
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
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
    marginBottom: 12,
    marginTop: -5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: '#999999',
  },
  signUpLink: {
    fontSize: 14,
    color: '#010312',
    fontWeight: '600',
  },
});


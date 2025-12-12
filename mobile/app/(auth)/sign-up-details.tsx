import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Input, Button, Toggle, Dropdown } from '@/components/ui';
import type { DropdownOption } from '@/components/ui/Dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';

export default function SignUpDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }>();
  
  const { signUpGeneral, signUpAgent } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Toggle для "I'm Real Estate Agent"
  const [isAgent, setIsAgent] = useState(false);

  // Поля для клієнта/інвестора
  const [budgetRange, setBudgetRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');

  // Поля для агента
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramNumber, setTelegramNumber] = useState('');
  const [fieldOfExpertise, setFieldOfExpertise] = useState('');

  const whatsappRef = useRef<TextInput>(null);
  const telegramRef = useRef<TextInput>(null);

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Перевірка, чи є дані з попереднього екрану
      if (!params.firstName || !params.lastName || !params.email || !params.phone || !params.password) {
        setError('Missing registration data. Please go back and fill the form again.');
        setIsLoading(false);
        return;
      }
      
      console.log('🔄 Starting registration...');
      console.log('📋 Registration data:', {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
        isAgent,
        phoneNumber,
      });
      
      // Перевірка phone
      if (!params.phone || params.phone.trim().length < 10) {
        setError('Phone number is required and must be at least 10 characters');
        setIsLoading(false);
        return;
      }
      
      if (isAgent) {
        // Реєстрація як BROKER
        // Використовуємо phone з першого екрану, або phoneNumber якщо вказано
        const brokerPhone = phoneNumber.trim() || params.phone;
        
        if (!brokerPhone.trim() || brokerPhone.trim().length < 10) {
          setError('Phone number is required for agents and must be at least 10 characters');
          setIsLoading(false);
          return;
        }
        
        // Для BROKER потрібен licenseNumber
        // Генеруємо тимчасовий licenseNumber (в реальному додатку це має бути введено користувачем)
        const licenseNumber = `BROKER-${Date.now()}`;
        
        console.log('📋 Registering as BROKER with:', {
          email: params.email,
          phone: brokerPhone,
          firstName: params.firstName,
          lastName: params.lastName,
          licenseNumber,
        });
        
        await signUpAgent({
          email: params.email,
          password: params.password,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: brokerPhone,
          role: UserRole.BROKER,
          whatsapp: whatsappNumber || undefined,
          telegram: telegramNumber || undefined,
          fieldOfExpertise: fieldOfExpertise || 'general',
          licenseNumber: licenseNumber,
        });
      } else {
        // Реєстрація як INVESTOR (для клієнтів/інвесторів)
        // Бекенд вимагає phone, використовуємо phone з першого екрану
        console.log('📋 Registering as INVESTOR with:', {
          email: params.email,
          phone: params.phone,
          firstName: params.firstName,
          lastName: params.lastName,
        });
        
        await signUpGeneral({
          email: params.email,
          password: params.password,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone,
          role: UserRole.INVESTOR, // Використовуємо INVESTOR замість CLIENT
        });
      }
      
      console.log('✅ Registration successful!');
      
      // Після успішної реєстрації перенаправляємо на home
      router.replace('/(tabs)/home');
    } catch (error: any) {
      try {
        console.error('❌ Registration error:', error?.message || error);
        console.error('Error status:', error.response?.status);
        
        // Безпечне логування response data
        if (error.response?.data) {
          try {
            const errorData = typeof error.response.data === 'string'
              ? error.response.data
              : JSON.stringify(error.response.data, null, 2);
            console.error('Error data:', errorData);
          } catch (stringifyError) {
            console.error('Error data: [Unable to stringify]');
          }
        }
      } catch (loggingError) {
        console.error('❌ Error in error handler:', loggingError);
      }
      
      let errorMessage = 'Registration failed. Please try again.';
      
      // Обробка різних типів помилок
      if (error.response?.status === 409) {
        // Conflict - користувач вже існує
        errorMessage = error.response?.data?.message || 'A user with this email or phone number already exists. Please use a different email or phone number.';
      } else if (error.response?.status === 400) {
        // Bad Request - невалідні дані
        errorMessage = error.response?.data?.message || 'Invalid data provided. Please check all fields and try again.';
      } else if (error.response?.status === 401) {
        // Unauthorized
        errorMessage = error.response?.data?.message || 'Authentication failed. Please try again.';
      } else if (error.response?.status === 500) {
        // Internal Server Error
        errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      Alert.alert(
        'Registration Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Options for dropdowns
  const budgetOptions: DropdownOption[] = [
    { label: '$100k - $300k', value: '100k-300k' },
    { label: '$300k - $500k', value: '300k-500k' },
    { label: '$500k - $1M', value: '500k-1m' },
    { label: '$1M+', value: '1m+' },
  ];

  const propertyTypeOptions: DropdownOption[] = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Penthouse', value: 'penthouse' },
  ];

  const purposeOptions: DropdownOption[] = [
    { label: 'Investment', value: 'investment' },
    { label: 'Living', value: 'living' },
    { label: 'Rent', value: 'rent' },
  ];

  const locationOptions: DropdownOption[] = [
    { label: 'Dubai Marina', value: 'dubai-marina' },
    { label: 'Downtown Dubai', value: 'downtown' },
    { label: 'Palm Jumeirah', value: 'palm' },
    { label: 'Business Bay', value: 'business-bay' },
  ];

  const expertiseOptions: DropdownOption[] = [
    { label: 'Residential Sales', value: 'residential-sales' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Luxury Properties', value: 'luxury' },
    { label: 'Investment Properties', value: 'investment' },
  ];

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
      router.push('/(auth)/sign-up-general');
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
        <Text style={styles.title}>PROVIDE MORE INFORMATION</Text>
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
            <Toggle
              label="I'm Real Estate Agent"
              value={isAgent}
              onValueChange={setIsAgent}
              fullWidth
              variant="light"
            />
            {!isAgent ? (
              // Client/Investor fields
              <>
                <Dropdown
                  placeholder="Budget Range"
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                  options={budgetOptions}
                  fullWidth
                />
                
                <Dropdown
                  placeholder="Property Type of Interest"
                  value={propertyType}
                  onValueChange={setPropertyType}
                  options={propertyTypeOptions}
                  fullWidth
                />
                
                <Dropdown
                  placeholder="Purpose"
                  value={purpose}
                  onValueChange={setPurpose}
                  options={purposeOptions}
                  fullWidth
                />
                
                <Dropdown
                  placeholder="Preferred Location"
                  value={preferredLocation}
                  onValueChange={setPreferredLocation}
                  options={locationOptions}
                  fullWidth
                />
              </>
            ) : (
              // Agent fields
              <>
                <Input
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  fullWidth
                  returnKeyType="next"
                  onSubmitEditing={() => whatsappRef.current?.focus()}
                  blurOnSubmit={false}
                  inputBackgroundColor="#FFFFFF"
                  inputBorderColor="#DFDFE0"
                  inputTextColor="#010312"
                  inputPlaceholderColor="#94A3B8"
                />
                
                <Input
                  ref={whatsappRef}
                  placeholder="WhatsApp Number"
                  value={whatsappNumber}
                  onChangeText={setWhatsappNumber}
                  fullWidth
                  returnKeyType="next"
                  onSubmitEditing={() => telegramRef.current?.focus()}
                  blurOnSubmit={false}
                  inputBackgroundColor="#FFFFFF"
                  inputBorderColor="#DFDFE0"
                  inputTextColor="#010312"
                  inputPlaceholderColor="#94A3B8"
                />
                
                <Input
                  ref={telegramRef}
                  placeholder="Telegram Number"
                  value={telegramNumber}
                  onChangeText={setTelegramNumber}
                  fullWidth
                  returnKeyType="done"
                  inputBackgroundColor="#FFFFFF"
                  inputBorderColor="#DFDFE0"
                  inputTextColor="#010312"
                  inputPlaceholderColor="#94A3B8"
                />
                
                <Dropdown
                  placeholder="Field of Expertise"
                  value={fieldOfExpertise}
                  onValueChange={setFieldOfExpertise}
                  options={expertiseOptions}
                  fullWidth
                />
              </>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <Button
              title={isLoading ? "Creating account..." : "Sign up"}
              variant="dark"
              fullWidth
              onPress={handleContinue}
              disabled={isLoading}
            />
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#010312" />
              </View>
            )}

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
  disclaimer: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'left',
    marginTop: 12,
    marginBottom: 48,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
});


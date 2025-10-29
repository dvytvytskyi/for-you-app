import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Input, Button, Toggle, Dropdown } from '@/components/ui';
import type { DropdownOption } from '@/components/ui/Dropdown';

export default function SignUpDetailsScreen() {
  const router = useRouter();
  
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

  const handleContinue = () => {
    // All fields are optional, so we can proceed directly
    // TODO: Send data to backend
    console.log('Sign up complete', {
      isAgent,
      ...(isAgent ? {
        phoneNumber,
        whatsappNumber,
        telegramNumber,
        fieldOfExpertise,
      } : {
        budgetRange,
        propertyType,
        purpose,
        preferredLocation,
      })
    });
    // After successful registration, redirect to tabs
    router.replace('/(tabs)/home');
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
                />
                
                <Input
                  ref={telegramRef}
                  placeholder="Telegram Number"
                  value={telegramNumber}
                  onChangeText={setTelegramNumber}
                  fullWidth
                  returnKeyType="done"
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

            <Button
              title="Sign up"
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
  disclaimer: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'left',
    marginTop: 12,
    marginBottom: 48,
  },
});


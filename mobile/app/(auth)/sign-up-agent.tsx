import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpAgentScreen() {
  const router = useRouter();
  const navigation = useNavigation();

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
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable onPress={handleGoBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </Pressable>

      <Text style={styles.title}>
        Sign Up Agent
      </Text>
      <Text style={styles.subtitle}>
        Waiting for UI components...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
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
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 8,
  },
});


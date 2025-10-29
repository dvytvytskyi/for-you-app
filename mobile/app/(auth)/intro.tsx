import { View, Text, Image, SafeAreaView, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo, Button } from '@/components/ui';

export default function IntroScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background Image as Overlay */}
      <Image
        source={require('@/assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      
      {/* Content */}
      <View style={styles.contentWrapper}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
              {/* Logo at top */}
              <View style={styles.logoContainer}>
                <Logo size="large" variant="white" />
              </View>

              {/* Headline */}
              <View style={styles.headlineContainer}>
                <Text style={styles.headline}>
                  Dozens of homes{'\n'}in one app
                </Text>
              </View>

              {/* Buttons at bottom */}
              <View style={styles.buttonsContainer}>
                <Button
                  title="Sign up"
                  variant="primary"
                  onPress={() => router.push('/(auth)/sign-up-general')}
                />

                <Button
                  title="I'm Investor"
                  variant="outline"
                  onPress={() => router.push('/(auth)/login')}
                />

                <Button
                  title="I'm Real Estate Agent"
                  variant="outline"
                  onPress={() => router.push('/(auth)/login')}
                />

                {/* Sign in text */}
                <Pressable onPress={() => router.push('/(auth)/login')} style={styles.signInContainer}>
                  <Text style={styles.signInText}>
                    Already have an account? <Text style={styles.signInLink}>Sign in</Text>
                  </Text>
                </Pressable>

                {/* Social Login */}
                <View style={styles.socialContainer}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010312',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: '50%',
    height: '100%',
    width: '100%',
    transform: [{ translateX: '-50%' }, { translateY: -180 }, { scale: 1.1}],
    transformOrigin: 'top center',
  },
  contentWrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    transform: [{ scale: 1.6 }],
    marginTop: -70,
  },
  headlineContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 40,
    fontFamily: 'CormorantGaramond_700Bold',
    textAlign: 'center',
    lineHeight: 50,
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
    marginTop: -150,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signInContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  signInText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  signInLink: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 0.5,
    borderColor: '#616161',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});


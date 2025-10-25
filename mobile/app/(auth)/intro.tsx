import { View, Text, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo, Button } from '@/components/ui';

export default function IntroScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800' }}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
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
                  onPress={() => router.push('/(auth)/sign-up-investor')}
                />

                <Button
                  title="I'm Real Estate Agent"
                  variant="outline"
                  onPress={() => router.push('/(auth)/sign-up-agent')}
                />

                {/* Already have account */}
                <Pressable onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.loginText}>
                    Already have account
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logoContainer: {
    marginTop: 48,
  },
  headlineContainer: {
    alignItems: 'center',
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 46,
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
});


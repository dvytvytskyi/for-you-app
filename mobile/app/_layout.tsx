import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts, CormorantGaramond_300Light, CormorantGaramond_400Regular, CormorantGaramond_600SemiBold, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const initializeLanguage = useLanguageStore((state) => state.initializeLanguage);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const themeMode = useThemeStore((state) => state.mode);

  useEffect(() => {
    // Initialize language and theme on app start
    initializeLanguage();
    initializeTheme();
  }, [initializeLanguage, initializeTheme]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Determine status bar style based on theme mode
  const getStatusBarStyle = () => {
    if (themeMode === 'dark') return 'light';
    if (themeMode === 'light') return 'dark';
    // For 'system', use 'auto' which adapts to system theme
    return 'auto';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={getStatusBarStyle()} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="profile" 
          options={{
            animation: 'slide_from_right',
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="property/[id]" 
          options={{
            animation: 'slide_from_right',
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="collections/[id]" 
          options={{
            animation: 'slide_from_right',
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="lead/[id]" 
          options={{
            animation: 'slide_from_right',
            presentation: 'card',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}


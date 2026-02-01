// @ts-ignore
if (typeof global !== 'undefined' && !global.__reanimatedLoggerConfig) {
  // @ts-ignore
  global.__reanimatedLoggerConfig = { level: 0, out: console.log };
}
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts, CormorantGaramond_300Light, CormorantGaramond_400Regular, CormorantGaramond_600SemiBold, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useState } from 'react';
import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Дані вважаються застарілими одразу
      gcTime: 0, // Не кешуємо дані
      refetchOnMount: true, // Завжди завантажуємо при монтуванні
      refetchOnWindowFocus: true, // Оновлюємо дані при поверненні на екран
      refetchOnReconnect: true, // Оновлюємо дані при відновленні з'єднання
      retry: 1,
    },
  },
});

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const initializeLanguage = useLanguageStore((state) => state.initializeLanguage);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const themeMode = useThemeStore((state) => state.mode);
  const isDark = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');
  const { isAuthenticated, loadUser } = useAuthStore();
  const syncFromServer = useFavoritesStore((state) => state.syncFromServer);

  const [isAppReady, setIsAppReady] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Initialize language and theme on app start
    initializeLanguage();
    initializeTheme();

    // Load user if token exists
    loadUser();
  }, [initializeLanguage, initializeTheme, loadUser]);

  useEffect(() => {
    // Sync favorites when user is authenticated
    if (isAuthenticated) {
      console.log('🔄 Syncing favorites after authentication...');
      syncFromServer().catch(err => {
        console.warn('⚠️ Failed to sync favorites on app start:', err);
      });
    }
  }, [isAuthenticated, syncFromServer]);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide native splash screen
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Determine status bar style based on theme mode

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {showAnimation && (
          <AnimatedSplashScreen
            isDark={isDark}
            onAnimationComplete={() => {
              setShowAnimation(false);
              setIsAppReady(true);
            }}
          />
        )}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="investor-chat"
            options={{
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
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
          <Stack.Screen
            name="project/[id]"
            options={{
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="news/[slug]"
            options={{
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="developers"
            options={{
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="developers/[id]"
            options={{
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="liked"
            options={{
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}


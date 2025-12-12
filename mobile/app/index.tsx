import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Loading state - чекаємо поки завантажується користувач
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#010312' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Redirect based on auth state
  // Якщо авторизований - на home, якщо ні - на інтро
  return <Redirect href={isAuthenticated ? "/(tabs)/home" : "/(auth)/intro"} />;
}


import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  // TODO: Check if user is authenticated
  // const { isAuthenticated, isLoading } = useAuth();

  // For now, redirect to intro
  return <Redirect href="/(auth)/intro" />;

  // Loading state
  // if (isLoading) {
  //   return (
  //     <View className="flex-1 items-center justify-center bg-dark-bg">
  //       <ActivityIndicator size="large" color="#3B82F6" />
  //     </View>
  //   );
  // }

  // Redirect based on auth state
  // return <Redirect href={isAuthenticated ? "/(client)" : "/(auth)/intro"} />;
}


import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="intro" options={{ gestureEnabled: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up-general" />
      <Stack.Screen name="sign-up-details" />
      <Stack.Screen name="sign-up-investor" />
      <Stack.Screen name="sign-up-agent" />
    </Stack>
  );
}


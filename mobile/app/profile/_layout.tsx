import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        presentation: 'card',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationDuration: 300,
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          animation: 'slide_from_right',
          freezeOnBlur: true,
        }}
      />
      <Stack.Screen 
        name="edit"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="change-password"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="notifications"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="language"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="privacy"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="terms"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="about"
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="theme"
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}


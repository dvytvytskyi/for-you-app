import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useTheme } from '@/utils/theme';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';

export default function TabsLayout() {
  const { theme, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  // Явна перевірка ролі
  const isInvestor = user?.role === 'INVESTOR' || user?.role === UserRole.INVESTOR;
  
  // Debug: log user role
  useEffect(() => {
    console.log('=== TABS LAYOUT ===');
    console.log('User role:', user?.role);
    console.log('Is Investor:', isInvestor);
    console.log('Should hide CRM tab:', !isInvestor);
  }, [user?.role, isInvestor]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: isDark ? '#FFFFFF' : '#102F73',
        tabBarInactiveTintColor: isDark ? '#FFFFFF99' : '#999999',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="properties"
        options={{
          title: 'Properties',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="liked"
        options={{
          title: 'Liked',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />
      
      {!isInvestor && (
        <Tabs.Screen
          name="crm"
          options={{
            title: 'CRM',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
            ),
          }}
        />
      )}
      
      <Tabs.Screen
        name="collections"
        options={{
          title: 'Collections',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'folder' : 'folder-outline'} size={24} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: 84,
    paddingBottom: 20,
    paddingTop: 4,
    paddingHorizontal: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});


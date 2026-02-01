import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useTheme } from '@/utils/theme';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';
import { TabBar } from '@/components/navigation/TabBar';

export default function TabsLayout() {
  const { theme, isDark } = useTheme();
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  const isInvestor = (user?.role as string) === 'INVESTOR';

  useEffect(() => {
    if (!isLoading) {
      console.log('=== TABS LAYOUT ===');
      console.log('User role:', user?.role);
      console.log('Is Investor:', isInvestor);
    }
  }, [user?.role, isInvestor, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
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
          title: 'Projects',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} size={24} color={color} />
          ),
        }}
      />


      <Tabs.Screen
        name="crm"
        options={{
          title: 'CRM',
          href: isInvestor ? null : '/crm',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        listeners={{
          tabPress: (e: any) => {
            e.preventDefault();
            router.push('/investor-chat');
          },
        }}
        options={{
          title: 'Chat',
          href: isInvestor ? '/investor-chat' : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="collections"
        options={{
          title: 'Collections',
          href: !isInvestor ? '/collections' : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'folder' : 'folder-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          href: isInvestor ? '/portfolio' : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={24} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    paddingBottom: 0,
    paddingTop: 0,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 8,
  },
});


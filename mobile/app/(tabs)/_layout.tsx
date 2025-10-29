import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#102F73',
        tabBarInactiveTintColor: '#999999',
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
      
      <Tabs.Screen
        name="crm"
        options={{
          title: 'CRM',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="collections"
        options={{
          title: 'Collections',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'folder' : 'folder-outline'} size={24} color={color} />
          ),
        }}
      />
      
      {/* Hide client-only tabs */}
      <Tabs.Screen
        name="map"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
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


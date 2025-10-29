import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Header, SearchBar, PropertyTypeFilter } from '@/components/ui';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Apartment']);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Dashboard" 
        avatar="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
      />
      
      <View style={styles.searchSection}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <PropertyTypeFilter 
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Welcome to For You Real Estate</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#010312',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});


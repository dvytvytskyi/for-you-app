import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/utils/theme';

interface PropertyTypeFilterProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

const propertyTypes = ['Apartment', 'Villa', 'Penthouse', 'Townhouse'];

export default function PropertyTypeFilter({ selectedTypes, onTypesChange }: PropertyTypeFilterProps) {
  const { theme } = useTheme();
  
  const handleTypePress = (type: string) => {
    if (selectedTypes.includes(type)) {
      // Remove type from selection
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      // Add type to selection
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {propertyTypes.map((type) => {
        const isSelected = selectedTypes.includes(type);
        return (
          <Pressable
            key={type}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: isSelected ? theme.primary : theme.card,
                borderColor: isSelected ? theme.primary : theme.border,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }]
              }
            ]}
            onPress={() => handleTypePress(type)}
          >
            <Text style={[styles.buttonText, { color: isSelected ? '#FFFFFF' : theme.text }]}>
              {type}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    // backgroundColor, borderColor applied dynamically
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    // color applied dynamically
  },
});


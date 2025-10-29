import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

interface PropertyTypeFilterProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

const propertyTypes = ['Apartment', 'Villa', 'Penthouse', 'Townhouse'];

export default function PropertyTypeFilter({ selectedTypes, onTypesChange }: PropertyTypeFilterProps) {
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
              isSelected && styles.buttonSelected,
              { 
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }]
              }
            ]}
            onPress={() => handleTypePress(type)}
          >
            <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
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
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  buttonSelected: {
    backgroundColor: '#102F73',
    borderColor: '#102F73',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#102F73',
  },
  buttonTextSelected: {
    color: '#FFFFFF',
  },
});


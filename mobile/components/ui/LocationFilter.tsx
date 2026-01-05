import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/utils/theme';

interface LocationFilterProps {
    selectedLocations: string[];
    onLocationsChange: (locations: string[]) => void;
}

const locations = ['Dubai Marina', 'Downtown', 'Business Bay', 'Palm Jumeirah', 'JVC'];

export default function LocationFilter({ selectedLocations, onLocationsChange }: LocationFilterProps) {
    const { theme } = useTheme();

    const handleLocationPress = (location: string) => {
        if (selectedLocations.includes(location)) {
            // Remove location from selection
            onLocationsChange(selectedLocations.filter(l => l !== location));
        } else {
            // Add location to selection
            onLocationsChange([...selectedLocations, location]);
        }
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {locations.map((location) => {
                const isSelected = selectedLocations.includes(location);
                return (
                    <Pressable
                        key={location}
                        style={({ pressed }) => [
                            styles.button,
                            {
                                backgroundColor: isSelected ? theme.primary : theme.card,
                                borderColor: isSelected ? theme.primary : theme.border,
                                opacity: pressed ? 0.7 : 1,
                                transform: [{ scale: pressed ? 0.95 : 1 }]
                            }
                        ]}
                        onPress={() => handleLocationPress(location)}
                    >
                        <Text style={[styles.buttonText, { color: isSelected ? '#FFFFFF' : theme.textTertiary }]}>
                            {location}
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
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

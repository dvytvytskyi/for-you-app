import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface CollectionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  gradientImage: any;
  onPress?: () => void;
}

export default function CollectionCard({ icon, title, description, gradientImage, onPress }: CollectionCardProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      {/* Solid Shadow Block */}
      <View style={[
        styles.shadowBlock,
        {
          backgroundColor: theme.primary,
          opacity: 0.25, // Less blue (lighter)
        }
      ]} />

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }]
          }
        ]}
      >
        <View style={styles.content}>
          {/* Left icon */}
          <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
            <Ionicons name={icon} size={20} color={theme.primary} />
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: '#FFFFFF' }]}>{title}</Text>
            <Text style={[styles.description, { color: 'rgba(255, 255, 255, 0.8)' }]}>{description}</Text>
          </View>

          {/* Right arrow - Thinner icon using Feather */}
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 6, // Compensate for shadow offset if needed
  },
  shadowBlock: {
    position: 'absolute',
    top: 4, // Even higher (closer to card)
    width: '96%', // Wider shadow
    height: '100%',
    alignSelf: 'center',
    borderRadius: 16,
    zIndex: -1, // Behind the main card
  },
  container: {
    width: '100%',
    height: 70,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
});


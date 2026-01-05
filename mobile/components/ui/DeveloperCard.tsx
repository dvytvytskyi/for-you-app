import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface DeveloperCardProps {
  logo?: string | null;
  name: string;
  description: string | null;
  projectsCount: number;
  gradientImage: any;
  onPress?: () => void;
}

export default function DeveloperCard({
  logo,
  name,
  description,
  projectsCount,
  gradientImage,
  onPress
}: DeveloperCardProps) {
  const { theme } = useTheme();

  // Обрізаємо опис якщо він занадто довгий
  const shortDescription = description
    ? (description.length > 80 ? description.substring(0, 80) + '...' : description)
    : 'No description available';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        }
      ]}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {logo ? (
            <Image
              source={{ uri: logo }}
              style={styles.logo}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="business" size={24} color={theme.textSecondary} />
          )}
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {shortDescription}
          </Text>
        </View>

        {/* Right arrow */}
        <Ionicons name="arrow-forward" size={20} color={theme.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
});

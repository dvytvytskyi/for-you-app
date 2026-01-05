import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <ImageBackground
        source={gradientImage}
        style={styles.gradient}
        imageStyle={styles.gradientImage}
        resizeMode="cover"
      >

        <View style={styles.content}>
          {/* Left icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
            <Ionicons name={icon} size={20} color="#FFFFFF" />
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
          </View>

          {/* Right arrow */}
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    // borderColor applied dynamically
  },
  gradient: {
    flex: 1,
  },
  gradientImage: {
    borderRadius: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor applied dynamically
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    // color applied dynamically
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    // color applied dynamically
    lineHeight: 16,
  },
});


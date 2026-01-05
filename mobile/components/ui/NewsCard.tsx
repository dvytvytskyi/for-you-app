import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useTheme } from '@/utils/theme';

interface NewsCardProps {
  image: string;
  title: string;
  description: string;
  timestamp: string;
  onPress: () => void;
}

export default function NewsCard({ image, title, description, timestamp, onPress }: NewsCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.9 : 1
        }
      ]}
    >
      <Image
        source={
          image && image.trim().length > 0 && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:') || image.startsWith('file://'))
            ? { uri: image }
            : require('@/assets/images/new logo blue.png')
        }
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>{description}</Text>
        <Text style={[styles.timestamp, { color: theme.textTertiary }]}>{timestamp}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // backgroundColor, borderColor applied dynamically
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 12,
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    // color applied dynamically
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    // color applied dynamically
    lineHeight: 16,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '400',
    // color applied dynamically
  },
});


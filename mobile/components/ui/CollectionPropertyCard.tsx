import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface CollectionPropertyCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  handoverDate: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function CollectionPropertyCard({
  image,
  title,
  description,
  price,
  handoverDate,
  onPress,
  onLongPress,
}: CollectionPropertyCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.border },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.primary }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
        <Text style={[styles.details, { color: theme.textSecondary }]}>
          {price} • Handover {handoverDate}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  details: {
    fontSize: 13,
    fontWeight: '400',
  },
});


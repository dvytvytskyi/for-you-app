import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  avatar?: string; // URL to avatar image
  onBack?: () => void;
}

export default function Header({ title, avatar, onBack }: HeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const handleAvatarPress = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/profile');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Title */}
      <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
      
      {/* Avatar */}
      <Pressable 
        onPress={handleAvatarPress} 
        style={({ pressed }) => [
          styles.avatarContainer,
          { 
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }]
          }
        ]}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : onBack ? (
          <Ionicons name="close" size={24} color={theme.textSecondary} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.border }]}>
            <Text style={[styles.avatarText, { color: theme.textTertiary }]}>👤</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 4,
    // backgroundColor applied dynamically
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: '600',
    // color applied dynamically
  },
  avatarContainer: {
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    // backgroundColor applied dynamically
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    // color applied dynamically
  },
});


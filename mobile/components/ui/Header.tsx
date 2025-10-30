import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme';

interface HeaderProps {
  title: string;
  avatar?: string; // URL to avatar image
}

export default function Header({ title, avatar }: HeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const handleAvatarPress = () => {
    router.push('/profile');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    // backgroundColor applied dynamically
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
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


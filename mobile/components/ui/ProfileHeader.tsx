import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface ProfileHeaderProps {
  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: 'BROKER' | 'INVESTOR' | 'ADMIN'; // Може бути undefined
  onEditPress: () => void;
  onAvatarPress?: () => void;
}

const getRoleConfig = (themePrimary: string) => ({
  BROKER: { label: 'Broker', icon: 'briefcase' as const, color: themePrimary },
  INVESTOR: { label: 'Investor', icon: 'trending-up' as const, color: themePrimary },
  ADMIN: { label: 'Admin', icon: 'shield-checkmark' as const, color: themePrimary },
});

export default function ProfileHeader({ avatar, firstName, lastName, email, role, onEditPress, onAvatarPress }: ProfileHeaderProps) {
  const { theme } = useTheme();

  // Нормалізуємо роль (uppercase) і додаємо fallback
  const normalizedRole = role?.toUpperCase() as 'BROKER' | 'INVESTOR' | 'ADMIN';
  const roleConfigs = getRoleConfig(theme.primary);
  const config = roleConfigs[normalizedRole] || roleConfigs.BROKER; // Fallback на BROKER, якщо роль невідома

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.avatarContainer}>
          <Pressable
            onPress={onAvatarPress}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 }
            ]}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                <Text style={[styles.avatarText, { color: theme.textInverse }]}>
                  {firstName[0]}{lastName[0]}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              {
                backgroundColor: theme.primary,
                borderColor: theme.background,
                opacity: pressed ? 0.7 : 1
              }
            ]}
            onPress={onEditPress}
          >
            <Ionicons name="camera" size={16} color={theme.textInverse} />
          </Pressable>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: theme.text }]}>{firstName} {lastName}</Text>

        <View style={[styles.roleContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name={config.icon} size={14} color={config.color} />
          <Text style={[styles.roleText, { color: theme.primary }]}>{config.label}</Text>
        </View>


      </View>

      <View style={[styles.separator, { backgroundColor: theme.backgroundSecondary }]}></View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  separator: {
    height: 20,
    backgroundColor: '#F7F7F7',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#102F73',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#102F73',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#010312',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    marginBottom: 24,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#102F73',
  },
  email: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
    paddingBottom: 12,
  },
});


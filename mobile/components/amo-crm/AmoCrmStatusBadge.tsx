import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface AmoCrmStatusBadgeProps {
  connected: boolean;
  onDisconnect?: () => void;
}

export function AmoCrmStatusBadge({ connected, onDisconnect }: AmoCrmStatusBadgeProps) {
  const { theme } = useTheme();

  if (!connected) return null;

  return (
    <View style={[styles.badge, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.badgeContent}>
        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
        <Text style={[styles.badgeText, { color: theme.text }]}>
          Підключено до AMO CRM
        </Text>
      </View>
      {onDisconnect && (
        <Pressable onPress={onDisconnect} style={styles.disconnectButton}>
          <Ionicons name="close-circle-outline" size={18} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disconnectButton: {
    padding: 4,
  },
});

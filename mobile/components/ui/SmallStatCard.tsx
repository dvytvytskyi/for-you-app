import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface SmallStatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
}

export default function SmallStatCard({ icon, title, value }: SmallStatCardProps) {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.contentRow}>
        <View style={[
          styles.iconContainer,
          {
            borderColor: theme.cardBorder,
            backgroundColor: isDark ? 'rgba(10, 132, 255, 0.1)' : '#F0F7FF'
          }
        ]}>
          <Ionicons name={icon} size={20} color={theme.primary} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
          <Text style={[styles.value, { color: theme.primary }]}>{value}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor, borderColor applied dynamically
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 0.5,
    // borderColor applied dynamically
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    gap: 2,
  },
  title: {
    fontSize: 11,
    fontWeight: '400',
    // color applied dynamically
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    // color applied dynamically
  },
});


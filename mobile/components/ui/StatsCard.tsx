import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface StatsCardProps {
  title: string;
  value: string;
  buttonText: string;
  onPress: () => void;
}

export default function StatsCard({ title, value, buttonText, onPress }: StatsCardProps) {
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
      {/* Background wave pattern would go here */}
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
          <Text style={[styles.value, { color: theme.primary }]}>{value}</Text>
        </View>
        
        <View style={styles.rightSection}>
          <Ionicons name="trending-up" size={24} color={theme.primary} />
          <View style={[styles.button, { backgroundColor: theme.primary }]}>
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>{buttonText}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor, borderColor applied dynamically
    borderRadius: 12,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    minHeight: 108,
    borderWidth: 0.5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 76,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 76,
  },
  title: {
    fontSize: 13,
    fontWeight: '400',
    // color applied dynamically
  },
  value: {
    fontSize: 40,
    fontWeight: '700',
    // color applied dynamically
    lineHeight: 48,
  },
  button: {
    // backgroundColor applied dynamically
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '500',
    // color applied dynamically
  },
});


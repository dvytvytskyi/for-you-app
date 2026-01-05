import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/utils/theme';

interface PaginationDotsProps {
  total: number;
  current: number;
}

export default function PaginationDots({ total, current }: PaginationDotsProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: theme.textTertiary, opacity: 1 },
            index === current && [styles.dotActive, { backgroundColor: theme.primary, opacity: 1 }],
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },
});


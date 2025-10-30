import { View, StyleSheet } from 'react-native';

interface PaginationDotsProps {
  total: number;
  current: number;
}

export default function PaginationDots({ total, current }: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === current && styles.dotActive,
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
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D9D9D9',
  },
  dotActive: {
    width: 20,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#102F73',
  },
});


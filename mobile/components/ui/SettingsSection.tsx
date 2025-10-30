import { View, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { useTheme } from '@/utils/theme';

interface SettingsSectionProps {
  title?: string;
  children: ReactNode;
  isFirst?: boolean;
}

export default function SettingsSection({ title, children, isFirst = false }: SettingsSectionProps) {
  const { theme } = useTheme();
  
  return (
    <>
      {!isFirst && <View style={[styles.separator, { backgroundColor: theme.backgroundSecondary }]} />}
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 20,
  },
  content: {
    // backgroundColor applied dynamically
  },
});


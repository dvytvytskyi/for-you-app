import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  hasArrow?: boolean;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onPress?: () => void;
  onSwitchChange?: (value: boolean) => void;
  isLast?: boolean;
}

export default function SettingsItem({
  icon,
  label,
  value,
  hasArrow = true,
  hasSwitch = false,
  switchValue = false,
  onPress,
  onSwitchChange,
  isLast = false,
}: SettingsItemProps) {
  const { theme } = useTheme();
  
  const content = (
    <View style={[
      styles.container, 
      isLast && styles.containerLast,
      { 
        backgroundColor: theme.background,
        borderBottomColor: theme.border
      }
    ]}>
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name={icon} size={20} color={theme.primary} />
        </View>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      </View>
      
      <View style={styles.rightContent}>
        {value && <Text style={[styles.value, { color: theme.textTertiary }]}>{value}</Text>}
        
        {hasSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.textInverse}
            ios_backgroundColor={theme.border}
          />
        ) : (
          hasArrow && <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
        )}
      </View>
    </View>
  );

  if (hasSwitch || !onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  containerLast: {
    borderBottomWidth: 0,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '400',
    color: '#010312',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: '400',
    color: '#999999',
  },
});


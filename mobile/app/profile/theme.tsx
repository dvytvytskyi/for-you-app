import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore, type ThemeMode } from '@/store/themeStore';
import { useTranslation } from '@/utils/i18n';
import { useTheme } from '@/utils/theme';

interface ThemeOption {
  mode: ThemeMode;
  icon: keyof typeof Ionicons.glyphMap;
}

const themeOptions: ThemeOption[] = [
  { mode: 'light', icon: 'sunny-outline' },
  { mode: 'dark', icon: 'moon-outline' },
  { mode: 'system', icon: 'phone-portrait-outline' },
];

export default function ThemeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const { mode, setMode } = useThemeStore();
  
  const handleThemeSelect = (selectedMode: ThemeMode) => {
    setMode(selectedMode);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t('profile.theme.title')}
        </Text>
        
        <View style={styles.backButton} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: theme.backgroundSecondary }]}>
          <Ionicons name="information-circle-outline" size={20} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {t('profile.theme.info')}
          </Text>
        </View>
        
        {/* Theme Options */}
        <View style={styles.themeList}>
          {themeOptions.map((option, index) => {
            const isSelected = mode === option.mode;
            
            return (
              <Pressable
                key={option.mode}
                style={({ pressed }) => [
                  styles.themeItem,
                  { 
                    backgroundColor: theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                  isSelected && styles.themeItemSelected,
                  index === 0 && styles.themeItemFirst,
                  index === themeOptions.length - 1 && styles.themeItemLast,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={() => handleThemeSelect(option.mode)}
              >
                <View style={[
                  styles.themeIcon, 
                  { backgroundColor: isSelected ? theme.primaryLight : theme.backgroundSecondary }
                ]}>
                  <Ionicons 
                    name={option.icon} 
                    size={24} 
                    color={isSelected ? theme.primary : theme.textSecondary} 
                  />
                </View>
                
                <View style={styles.themeContent}>
                  <Text style={[
                    styles.themeName,
                    { color: isSelected ? theme.primary : theme.text }
                  ]}>
                    {t(`profile.theme.${option.mode}`)}
                  </Text>
                  <Text style={[
                    styles.themeDescription,
                    { color: isSelected ? theme.primary : theme.textSecondary }
                  ]}>
                    {t(`profile.theme.${option.mode}Description`)}
                  </Text>
                </View>
                
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  themeList: {
    paddingHorizontal: 16,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  themeItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  themeItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 1,
  },
  themeItemSelected: {
    borderWidth: 2,
    borderBottomWidth: 2,
  },
  themeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeContent: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 14,
  },
});


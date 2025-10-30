import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, type Language } from '@/store/languageStore';
import { useTranslation } from '@/utils/i18n';
import { useTheme } from '@/utils/theme';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ua', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Russian', nativeName: 'Русський', flag: '🇷🇺' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  // Get language from store
  const { language: currentLanguage, setLanguage } = useLanguageStore();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);
  
  // Check if language changed
  const hasChanges = selectedLanguage !== currentLanguage;
  
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        t('common.unsavedChanges'),
        t('common.unsavedChangesMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.leave'), style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };
  
  const handleSave = () => {
    if (!hasChanges) return;
    
    // Update language in store
    setLanguage(selectedLanguage);
    
    // Language changed successfully - UI will update automatically
    // No need to navigate back or show alert
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
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('profile.languageTitle')}</Text>
        
        <View style={styles.backButton} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: theme.backgroundSecondary }]}>
          <Ionicons name="language-outline" size={20} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {t('profile.languageInfo')}
          </Text>
        </View>
        
        {/* Language Options */}
        <View style={styles.languageList}>
          {languages.map((language, index) => {
            const isSelected = selectedLanguage === language.code;
            return (
              <Pressable
                key={language.code}
                style={({ pressed }) => [
                  styles.languageItem,
                  {
                    backgroundColor: isSelected ? theme.primaryLight : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                  index === 0 && styles.languageItemFirst,
                  index === languages.length - 1 && styles.languageItemLast,
                  isSelected && styles.languageItemSelected,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={() => setSelectedLanguage(language.code)}
              >
                <View style={[styles.languageIcon, { backgroundColor: theme.backgroundSecondary }]}>
                  <Text style={styles.flagEmoji}>{language.flag}</Text>
                </View>
                
                <View style={styles.languageContent}>
                  <Text style={[
                    styles.languageName,
                    { color: isSelected ? theme.primary : theme.text }
                  ]}>
                    {language.name}
                  </Text>
                  <Text style={[
                    styles.languageNative,
                    { color: isSelected ? theme.primary : theme.textSecondary }
                  ]}>
                    {language.nativeName}
                  </Text>
                </View>
                
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
        
        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: hasChanges ? theme.primary : theme.border },
              { opacity: pressed && hasChanges ? 0.9 : 1, transform: [{ scale: pressed && hasChanges ? 0.98 : 1 }] }
            ]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text style={[styles.saveButtonText, { color: hasChanges ? '#FFFFFF' : theme.textTertiary }]}>
              {t('profile.changeLanguage')}
            </Text>
          </Pressable>
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
  languageList: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderWidth: 0.5,
    borderBottomWidth: 0,
  },
  languageItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  languageItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0.5,
  },
  languageItemSelected: {
    borderWidth: 2,
    borderBottomWidth: 2,
  },
  languageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 28,
  },
  languageContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});


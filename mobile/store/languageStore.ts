import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

export type Language = 'en' | 'ua' | 'ru';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  initializeLanguage: () => Promise<void>;
}

// Get device language
const getDeviceLanguage = (): Language => {
  const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
  
  // Map device language to supported languages
  switch (deviceLocale) {
    case 'uk':
    case 'ua':
      return 'ua';
    case 'ru':
      return 'ru';
    case 'en':
    default:
      return 'en';
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en', // Default, will be overwritten by persisted value or device language
      
      setLanguage: (language: Language) => {
        set({ language });
      },
      
      initializeLanguage: async () => {
        try {
          // Check if language is already persisted
          const stored = await AsyncStorage.getItem('language-storage');
          
          if (!stored) {
            // First time - use device language
            const deviceLanguage = getDeviceLanguage();
            set({ language: deviceLanguage });
          }
        } catch (error) {
          console.error('Error initializing language:', error);
          // Fallback to device language
          set({ language: getDeviceLanguage() });
        }
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


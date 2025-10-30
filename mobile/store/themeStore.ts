import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system', // Default to system preference
      
      setMode: (mode: ThemeMode) => {
        set({ mode });
      },
      
      initializeTheme: async () => {
        try {
          // Check if theme is already persisted
          const stored = await AsyncStorage.getItem('theme-storage');
          
          if (!stored) {
            // First time - use system theme
            set({ mode: 'system' });
          }
        } catch (error) {
          console.error('Error initializing theme:', error);
          // Fallback to system theme
          set({ mode: 'system' });
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


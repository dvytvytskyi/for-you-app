import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { lightTheme, darkTheme, type Theme } from '@/constants/Theme';

export const useTheme = (): { theme: Theme; isDark: boolean } => {
  const mode = useThemeStore((state) => state.mode);
  const systemTheme = useColorScheme();
  
  // Determine effective theme
  let effectiveTheme: 'light' | 'dark';
  
  if (mode === 'system') {
    effectiveTheme = systemTheme === 'dark' ? 'dark' : 'light';
  } else {
    effectiveTheme = mode;
  }
  
  const theme = effectiveTheme === 'dark' ? darkTheme : lightTheme;
  const isDark = effectiveTheme === 'dark';
  
  return { theme, isDark };
};


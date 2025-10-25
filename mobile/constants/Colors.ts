/**
 * Design System Colors - For You Real Estate
 * Auth screens = Dark theme
 * Main app = Light theme
 */

export const Colors = {
  // Dark theme (Auth screens)
  dark: {
    bg: '#0A0A0A',
    surface: '#1A1A1A',
    border: '#2A2A2A',
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
      disabled: '#666666',
    },
  },

  // Light theme (Main app)
  light: {
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#E2E8F0',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      disabled: '#CBD5E1',
    },
  },

  // Brand colors
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
  },

  // Semantic colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Input states
  input: {
    bg: '#F1F5F9',
    border: '#E2E8F0',
    placeholder: '#94A3B8',
    focus: '#3B82F6',
    error: '#EF4444',
  },
} as const;


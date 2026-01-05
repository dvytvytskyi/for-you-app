export const lightTheme = {
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#FAFAFA',

  // Text colors
  text: '#010312',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',

  // Brand colors
  primary: '#102F73',
  primaryLight: '#F8F9FE',

  // Border colors
  border: '#E5E5E5',
  borderLight: '#DFDFE0',

  // State colors
  success: '#34C759',
  error: '#EF4444',
  warning: '#FF9500',
  info: '#007AFF',

  // Card colors
  card: '#FFFFFF',
  cardBorder: '#E5E5E5',

  // Input colors
  inputBackground: '#FFFFFF',
  inputBorder: '#DFDFE0',
  inputPlaceholder: '#94A3B8',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  // Background colors
  background: '#010312',
  backgroundSecondary: '#0B0D1E',
  backgroundTertiary: '#0B0D1E',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#888899',
  textInverse: '#010312',

  // Brand colors
  primary: '#0A84FF',
  primaryLight: '#0B0D1E',

  // Border colors
  border: '#0B0D1E',
  borderLight: '#0B0D1E',

  // State colors
  success: '#30D158',
  error: '#FF453A',
  warning: '#FF9F0A',
  info: '#0A84FF',

  // Card colors
  card: '#0B0D1E',
  cardBorder: '#0B0D1E',

  // Input colors
  inputBackground: '#0B0D1E',
  inputBorder: '#0B0D1E',
  inputPlaceholder: '#888899',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export type Theme = typeof lightTheme;

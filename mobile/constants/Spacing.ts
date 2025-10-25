/**
 * Design System Spacing & Layout
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
  button: 12,
  input: 12,
  card: 16,
} as const;

export const Layout = {
  // Screen padding
  screenHorizontal: 16,
  screenVertical: 24,

  // Component sizes
  buttonHeight: {
    small: 40,
    medium: 48,
    large: 56,
  },
  inputHeight: 56,
  
  // Touch targets (minimum 44x44 for accessibility)
  minTouchTarget: 44,
} as const;


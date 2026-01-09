export const colors = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  border: '#E2E8F0',
  primary: '#0EA5A4',
  primaryPressed: '#0D9488',
  primarySubtle: '#CCFBF1',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
} as const;

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
} as const;

export const spacing = {
  screenPadding: 16,
  cardPadding: 16,
  gap: 12,
  buttonHeight: 52,
} as const;

export const radius = {
  card: 16,
  input: 14,
  chip: 999,
} as const;

export const shadow = {
  subtle: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: {
      elevation: 2,
    },
  },
} as const;

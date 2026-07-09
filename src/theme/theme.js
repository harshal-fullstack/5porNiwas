// src/theme/theme.js
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Brand Colors
  primary: '#FFC72C', // Banana Gold
  primaryLight: '#FDB813',
  primaryDark: '#E6A100',
  
  // Backgrounds
  background: '#0F172A', // Slate Deep Dark
  cardBg: '#1E293B', // Slate Medium
  cardBgLight: '#334155', // Slate Light
  
  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.04)',
  borderFocus: 'rgba(255, 199, 44, 0.5)',

  // Text
  textPrimary: '#F8FAFC', // Slate 50
  textSecondary: '#94A3B8', // Slate 400
  textMuted: '#64748B', // Slate 500
  textGold: '#FFD700',
  
  // Statuses
  paid: '#10B981', // Emerald Green
  pending: '#F59E0B', // Amber Gold
  overdue: '#EF4444', // Rose Red
  vacant: '#64748B', // Slate Muted
  maintenance: '#3B82F6', // Royal Blue
  
  // Transparents
  glassBg: 'rgba(30, 41, 59, 0.7)',
  overlayBg: 'rgba(15, 23, 42, 0.85)',
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  
  // Border Radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,

  // Device Dimensions
  width,
  height,
};

export const FONTS = {
  titleLarge: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  titleMedium: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  titleSmall: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textMuted,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  }
};

export const SHADOWS = {
  premium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  button: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }
};

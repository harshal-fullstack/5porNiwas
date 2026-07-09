// src/components/MetricCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS, FONTS } from '../theme/theme';

export default function MetricCard({ title, value, icon: Icon, color, subtitle, trend, gradient = false }) {
  const CardContent = () => (
    <View style={styles.cardContent}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, gradient && styles.textDarkMuted]}>{title}</Text>
        {Icon && (
          <View style={[styles.iconContainer, { backgroundColor: gradient ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)' }]}>
            <Icon size={18} color={gradient ? '#0F172A' : color || COLORS.primary} />
          </View>
        )}
      </View>
      
      <Text style={[styles.value, gradient && styles.textDark]}>{value}</Text>
      
      <View style={styles.footerRow}>
        {subtitle && (
          <Text style={[styles.subtitle, gradient && styles.textDarkSecondary]}>{subtitle}</Text>
        )}
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: gradient ? 'rgba(0,0,0,0.15)' : 'rgba(16, 185, 129, 0.15)' }]}>
            <Text style={[styles.trendText, { color: gradient ? '#0F172A' : COLORS.paid }]}>{trend}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={[COLORS.primary, '#E69E00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, SHADOWS.premium]}
      >
        <CardContent />
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, styles.glassCard]}>
      <CardContent />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    flex: 1,
    minWidth: 150,
    margin: SIZES.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  glassCard: {
    backgroundColor: COLORS.cardBg,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardContent: {
    justifyContent: 'space-between',
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  title: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  textDarkMuted: {
    color: 'rgba(15, 23, 42, 0.7)',
  },
  iconContainer: {
    padding: SIZES.sm,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...FONTS.titleMedium,
    color: COLORS.textPrimary,
    fontSize: 24,
    marginVertical: SIZES.xs,
  },
  textDark: {
    color: '#0F172A',
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  subtitle: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
    flex: 1,
    marginRight: SIZES.xs,
  },
  textDarkSecondary: {
    color: 'rgba(15, 23, 42, 0.6)',
    fontWeight: '500',
  },
  trendBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs / 2,
    borderRadius: SIZES.radiusFull,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

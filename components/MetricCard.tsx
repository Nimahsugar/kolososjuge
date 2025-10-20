import { CardStyles, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  iconColor?: string;
  iconBackground?: string;
}

/**
 * MetricCard - Display component for dashboard metrics
 * Shows an icon, numeric value, and descriptive label
 * 
 * @example
 * <MetricCard
 *   icon="people-outline"
 *   value={24}
 *   label="Total Tenants"
 *   iconColor={Colors.primary}
 * />
 */
export function MetricCard({
  icon,
  value,
  label,
  iconColor = Colors.primary,
  iconBackground = Colors.primaryLight,
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={28} color={iconColor} />
      </View>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CardStyles.metricCard,
    flex: 1,
    minHeight: 140,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  value: {
    ...Typography.h5,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    flexShrink: 1,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});


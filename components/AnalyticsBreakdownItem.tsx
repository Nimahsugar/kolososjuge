import { Colors, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AnalyticsBreakdownItemProps {
  label: string;
  value: string | number;
  color?: string;
  isLast?: boolean;
}

/**
 * AnalyticsBreakdownItem - Display item for breakdown lists
 * Shows a label and value with optional color coding
 * 
 * @example
 * <AnalyticsBreakdownItem
 *   label="Maintenance"
 *   value="$1,200.00"
 *   color={Colors.primary}
 * />
 */
export function AnalyticsBreakdownItem({
  label,
  value,
  color = Colors.textPrimary,
  isLast = false,
}: AnalyticsBreakdownItemProps) {
  return (
    <View style={[styles.container, !isLast && styles.borderBottom]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: Spacing.md,
  },
  value: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
});


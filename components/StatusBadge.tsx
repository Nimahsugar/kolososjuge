import { BadgeStyles } from '@/constants/theme';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

type BadgeStatus = 'paid' | 'pending' | 'overdue';

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  style?: ViewStyle;
}

/**
 * StatusBadge - Reusable status badge component with color-coded variants
 * 
 * @example
 * <StatusBadge status="paid" />
 * 
 * @example
 * <StatusBadge status="overdue" label="Payment Overdue" />
 */
export function StatusBadge({ 
  status, 
  label,
  style 
}: StatusBadgeProps) {
  const getStatusStyle = (): ViewStyle => {
    switch (status) {
      case 'paid':
        return BadgeStyles.paid;
      case 'pending':
        return BadgeStyles.pending;
      case 'overdue':
        return BadgeStyles.overdue;
      default:
        return BadgeStyles.pending;
    }
  };

  const getStatusLabel = (): string => {
    if (label) return label;
    
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };

  return (
    <View style={[BadgeStyles.badge, getStatusStyle(), style]}>
      <Text style={BadgeStyles.badgeText}>{getStatusLabel()}</Text>
    </View>
  );
}


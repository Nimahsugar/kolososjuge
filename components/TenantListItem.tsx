import { CardStyles, Colors, Spacing, Typography } from '@/constants/theme';
import { Tenant } from '@/types/models';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBadge } from './StatusBadge';

interface TenantListItemProps {
  tenant: Tenant;
  onPress: (tenantId: string) => void;
}

/**
 * TenantListItem - Individual tenant card for list display
 * Shows tenant name, property, due date, and payment status
 * 
 * Performance optimizations:
 * - Memoized with React.memo to prevent unnecessary re-renders
 * - Helper functions memoized with useMemo/useCallback
 * 
 * @example
 * <TenantListItem
 *   tenant={tenant}
 *   onPress={(id) => router.push(`/tenants/${id}`)}
 * />
 */
export const TenantListItem = React.memo(function TenantListItem({ tenant, onPress }: TenantListItemProps) {
  // Memoize helper function results
  const initials = useMemo(() => {
    const parts = tenant.name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [tenant.name]);

  const dueDate = useMemo(() => {
    if (!tenant.dueDate) return 'Not set';
    try {
      return format(new Date(tenant.dueDate), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  }, [tenant.dueDate]);

  const propertyDisplay = useMemo(() => {
    const { propertyAddress, unitNumber } = tenant;
    if (unitNumber) {
      return `${propertyAddress} - Unit ${unitNumber}`;
    }
    return propertyAddress;
  }, [tenant.propertyAddress, tenant.unitNumber]);

  const rentAmount = useMemo(() => {
    return `₦${tenant.rentAmount.toFixed(2)}/year`;
  }, [tenant.rentAmount]);

  const handlePress = useCallback(() => {
    onPress(tenant.id);
  }, [onPress, tenant.id]);

  return (
    <TouchableOpacity
      style={CardStyles.listItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar Circle */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Tenant Info */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {tenant.name}
        </Text>
        <Text style={styles.property} numberOfLines={1}>
          {propertyDisplay}
        </Text>
        <Text style={styles.amount}>
          {rentAmount}
        </Text>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <StatusBadge status={tenant.paymentStatus} />
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>

      {/* Chevron Icon */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={Colors.textTertiary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h5,
    color: Colors.primary,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  name: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  property: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  amount: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'flex-end',
    marginRight: Spacing.sm,
  },
  dueDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  chevron: {
    marginLeft: Spacing.xs,
  },
});


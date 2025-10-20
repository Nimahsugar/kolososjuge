import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ActivityType = 'tenant' | 'expense';

interface RecentActivityItemProps {
  type: ActivityType;
  description: string;
  date: string; // ISO date string
}

/**
 * RecentActivityItem - Display component for recent activity
 * Shows icon, description, and relative time
 * 
 * @example
 * <RecentActivityItem
 *   type="tenant"
 *   description="Added John Doe as tenant"
 *   date="2024-01-15T10:30:00Z"
 * />
 */
export function RecentActivityItem({
  type,
  description,
  date,
}: RecentActivityItemProps) {
  const getActivityIcon = (): keyof typeof Ionicons.glyphMap => {
    return type === 'tenant' ? 'person-add-outline' : 'receipt-outline';
  };

  const getIconColor = (): string => {
    return type === 'tenant' ? Colors.primary : Colors.secondary;
  };

  const getIconBackground = (): string => {
    return type === 'tenant' ? Colors.primaryLight : Colors.secondaryLight;
  };

  const formatRelativeTime = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
        <Ionicons name={getActivityIcon()} size={20} color={getIconColor()} />
      </View>
      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(date)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  description: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  time: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});


import { CardStyles, Colors, Spacing, Typography } from '@/constants/theme';
import { Expense } from '@/types/models';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExpenseListItemProps {
  expense: Expense;
  onPress: (expenseId: string) => void;
  onTogglePaid?: (expenseId: string) => void;
}

// Helper functions moved outside component to prevent recreation
const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    maintenance: 'construct-outline',
    repairs: 'hammer-outline',
    utilities: 'water-outline',
    insurance: 'shield-checkmark-outline',
    taxes: 'document-text-outline',
    supplies: 'cart-outline',
    other: 'ellipsis-horizontal-circle-outline',
  };
  return icons[category] || 'receipt-outline';
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    maintenance: '#3B82F6',
    repairs: '#EF4444',
    utilities: '#10B981',
    insurance: '#8B5CF6',
    taxes: '#F59E0B',
    supplies: '#06B6D4',
    other: Colors.textTertiary,
  };
  return colors[category] || Colors.primary;
};

/**
 * ExpenseListItem - Individual expense card for list display
 * Shows expense details with category icon and payment status
 * 
 * Performance optimizations:
 * - Memoized with React.memo to prevent unnecessary re-renders
 * - Helper functions extracted outside component
 * - Callbacks memoized with useCallback
 * 
 * @example
 * <ExpenseListItem
 *   expense={expense}
 *   onPress={(id) => router.push(`/expenses/edit/${id}`)}
 *   onTogglePaid={handleTogglePaid}
 * />
 */
export const ExpenseListItem = React.memo(function ExpenseListItem({ 
  expense, 
  onPress,
  onTogglePaid 
}: ExpenseListItemProps) {
  
  const categoryIcon = useMemo(() => getCategoryIcon(expense.category), [expense.category]);
  const categoryColor = useMemo(() => getCategoryColor(expense.category), [expense.category]);

  const formattedDate = useMemo(() => {
    try {
      return format(new Date(expense.date), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  }, [expense.date]);

  const formattedCategory = useMemo(() => {
    return expense.category.charAt(0).toUpperCase() + expense.category.slice(1);
  }, [expense.category]);

  const formattedAmount = useMemo(() => {
    return `₦${expense.amount.toFixed(2)}`;
  }, [expense.amount]);

  const handlePress = useCallback(() => {
    onPress(expense.id);
  }, [onPress, expense.id]);

  const handleTogglePaid = useCallback((e: any) => {
    e.stopPropagation();
    if (onTogglePaid) {
      onTogglePaid(expense.id);
    }
  }, [onTogglePaid, expense.id]);

  return (
    <TouchableOpacity
      style={[
        CardStyles.listItem,
        expense.isPaid && styles.paidCard
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Category Icon */}
      <View 
        style={[
          styles.iconContainer,
          { backgroundColor: categoryColor + '15' }
        ]}
      >
        <Ionicons
          name={categoryIcon}
          size={24}
          color={categoryColor}
        />
      </View>

      {/* Expense Info */}
      <View style={styles.content}>
        <Text 
          style={[
            styles.description,
            expense.isPaid && styles.paidText
          ]} 
          numberOfLines={1}
        >
          {expense.description}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>
            {formattedCategory}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.date}>
            {formattedDate}
          </Text>
        </View>
        {expense.notes && (
          <Text style={styles.notes} numberOfLines={1}>
            {expense.notes}
          </Text>
        )}
      </View>

      {/* Amount and Status */}
      <View style={styles.rightSection}>
        <Text 
          style={[
            styles.amount,
            expense.isPaid && styles.paidText
          ]}
        >
          {formattedAmount}
        </Text>
        
        {/* Paid/Unpaid Toggle Button */}
        <TouchableOpacity
          style={[
            styles.statusBadge,
            expense.isPaid ? styles.paidBadge : styles.unpaidBadge
          ]}
          onPress={handleTogglePaid}
          activeOpacity={0.7}
        >
          <Ionicons
            name={expense.isPaid ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={expense.isPaid ? Colors.success : Colors.textTertiary}
          />
          <Text 
            style={[
              styles.statusText,
              expense.isPaid ? styles.paidStatusText : styles.unpaidStatusText
            ]}
          >
            {expense.isPaid ? 'Paid' : 'Unpaid'}
          </Text>
        </TouchableOpacity>
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  description: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  category: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  separator: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.xs,
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  notes: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
    marginRight: Spacing.sm,
  },
  amount: {
    ...Typography.h5,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: 4,
  },
  paidBadge: {
    backgroundColor: Colors.successLight,
  },
  unpaidBadge: {
    backgroundColor: Colors.gray100,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  paidStatusText: {
    color: Colors.success,
  },
  unpaidStatusText: {
    color: Colors.textSecondary,
  },
  chevron: {
    marginLeft: Spacing.xs,
  },
  paidCard: {
    opacity: 0.75,
  },
  paidText: {
    opacity: 0.7,
  },
});


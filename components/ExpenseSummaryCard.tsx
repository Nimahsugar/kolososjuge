import { CardStyles, Colors, Spacing, Typography } from '@/constants/theme';
import { Expense } from '@/types/models';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ExpenseSummaryCardProps {
  expenses: Expense[];
}

/**
 * ExpenseSummaryCard - Summary card showing expense statistics
 * Displays total expenses, paid vs unpaid breakdown
 * 
 * @example
 * <ExpenseSummaryCard expenses={expenses} />
 */
export function ExpenseSummaryCard({ expenses }: ExpenseSummaryCardProps) {
  const calculateStats = () => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const paid = expenses
      .filter(exp => exp.isPaid)
      .reduce((sum, exp) => sum + exp.amount, 0);
    const unpaid = total - paid;
    const paidCount = expenses.filter(exp => exp.isPaid).length;
    const unpaidCount = expenses.length - paidCount;

    return { total, paid, unpaid, paidCount, unpaidCount };
  };

  const stats = calculateStats();

  return (
    <View style={[CardStyles.card, styles.container]}>
      {/* Total Section */}
      <View style={styles.totalSection}>
        <View style={styles.iconBadge}>
          <Ionicons name="receipt" size={24} color={Colors.primary} />
        </View>
        <View style={styles.totalContent}>
          <Text style={styles.totalLabel}>Total Expenses</Text>
          <Text style={styles.totalAmount}>
            ₦{stats.total.toFixed(2)}
          </Text>
          <Text style={styles.totalCount}>
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Breakdown Section */}
      <View style={styles.breakdownSection}>
        {/* Paid Column */}
        <View style={styles.statColumn}>
          <View style={styles.statRow}>
            <Ionicons 
              name="checkmark-circle" 
              size={16} 
              color={Colors.success} 
            />
            <Text style={styles.statLabel}>Paid</Text>
          </View>
          <Text style={[styles.statAmount, styles.paidAmount]}>
            ₦{stats.paid.toFixed(2)}
          </Text>
          <Text style={styles.statCount}>
            {stats.paidCount} {stats.paidCount === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Unpaid Column */}
        <View style={styles.statColumn}>
          <View style={styles.statRow}>
            <Ionicons 
              name="ellipse-outline" 
              size={16} 
              color={Colors.textTertiary} 
            />
            <Text style={styles.statLabel}>Unpaid</Text>
          </View>
          <Text style={[styles.statAmount, styles.unpaidAmount]}>
            ₦{stats.unpaid.toFixed(2)}
          </Text>
          <Text style={styles.statCount}>
            {stats.unpaidCount} {stats.unpaidCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  totalContent: {
    flex: 1,
  },
  totalLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  totalAmount: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  totalCount: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  breakdownSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  statAmount: {
    ...Typography.h4,
    fontWeight: '600',
    marginBottom: 2,
  },
  paidAmount: {
    color: Colors.success,
  },
  unpaidAmount: {
    color: Colors.textPrimary,
  },
  statCount: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
});


import { ExpenseListItem } from '@/components/ExpenseListItem';
import { ExpenseSummaryCard } from '@/components/ExpenseSummaryCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Colors, FABStyles, Spacing, Typography } from '@/constants/theme';
import { Expense } from '@/types/models';
import { getExpenses, updateExpense } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Expenses Screen - List of all property expenses
 * Shows expense items with categories and payment status
 * 
 * Implementation: Phase 4, Step 1
 * Phase 9: Performance optimizations - useCallback for renderItem and keyExtractor
 */
export default function ExpensesScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Load expenses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadExpenses();
    }, [])
  );

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      // Sort by date (newest first)
      const sorted = data.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setExpenses(sorted);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpensePress = useCallback((expenseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/expenses/edit/${expenseId}` as any);
  }, [router]);

  const handleTogglePaid = useCallback(async (expenseId: string) => {
    try {
      // Find the expense
      const expense = expenses.find(e => e.id === expenseId);
      if (!expense) return;

      // Toggle paid status
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const success = await updateExpense(expenseId, {
        isPaid: !expense.isPaid,
      });

      if (success) {
        // Update local state immediately for better UX
        setExpenses(prev =>
          prev.map(e =>
            e.id === expenseId ? { ...e, isPaid: !e.isPaid } : e
          )
        );
      } else {
        Alert.alert('Error', 'Failed to update expense status');
      }
    } catch (error) {
      console.error('Error toggling expense status:', error);
      Alert.alert('Error', 'Failed to update expense status');
    }
  }, [expenses]);

  const handleAddExpense = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/expenses/add');
  }, [router]);

  // Memoized render functions for FlatList performance
  // Must be defined before any conditional returns to follow Rules of Hooks
  const renderItem = useCallback(({ item }: { item: Expense }) => (
    <ExpenseListItem 
      expense={item} 
      onPress={handleExpensePress}
      onTogglePaid={handleTogglePaid}
    />
  ), [handleExpensePress, handleTogglePaid]);

  const keyExtractor = useCallback((item: Expense) => item.id, []);

  const ListHeaderComponent = useCallback(() => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <Text style={styles.headerSubtitle}>
          Track your property expenses
        </Text>
      </View>
      <ExpenseSummaryCard expenses={expenses} />
    </>
  ), [expenses]);

  // Loading State
  if (loading) {
    return (
      <ScreenContainer centered>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </ScreenContainer>
    );
  }

  // Empty State
  if (expenses.length === 0) {
    return (
      <ScreenContainer centered>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="receipt-outline"
            size={80}
            color={Colors.textTertiary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No expenses recorded</Text>
          <Text style={styles.emptySubtitle}>
            Start tracking your property expenses
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddExpense}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={styles.emptyButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // List View
  return (
    <ScreenContainer noPadding>
      <FlatList
        data={expenses}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={FABStyles.fab}
        onPress={handleAddExpense}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.screenPadding,
  },
  header: {
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.screenPadding,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 24,
    gap: Spacing.sm,
  },
  emptyButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
});


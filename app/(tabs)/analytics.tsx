import { AnalyticsBreakdownItem } from '@/components/AnalyticsBreakdownItem';
import { AnalyticsChartCard } from '@/components/AnalyticsChartCard';
import { MetricCard } from '@/components/MetricCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { CardStyles, Colors, Spacing, Typography } from '@/constants/theme';
import { Expense, Tenant } from '@/types/models';
import {
    calculateNetIncome,
    calculateTotalExpenses,
    calculateTotalRevenue,
    formatCurrency,
    getMonthlyExpensesData,
    getMonthlyRevenueData,
    getPaymentStatusBreakdown,
    getTopExpenses,
} from '@/utils/analytics';
import { getExpenses, getTenants } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

/**
 * Analytics Screen - Financial statistics and charts
 * Shows revenue, expenses, and trends over time
 * 
 * Implementation: Phase 7
 */
export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadAnalyticsData();
    }, [])
  );

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [tenantsData, expensesData] = await Promise.all([
        getTenants(),
        getExpenses(),
      ]);
      
      setTenants(tenantsData);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalRevenue = calculateTotalRevenue(tenants);
  const totalExpenses = calculateTotalExpenses(expenses);
  const netIncome = calculateNetIncome(totalRevenue, totalExpenses);

  // Get chart data
  const monthlyRevenueData = getMonthlyRevenueData(tenants, 6);
  const monthlyExpensesData = getMonthlyExpensesData(expenses, 6);

  // Get breakdown data
  const topExpenses = getTopExpenses(expenses, 5);
  const paymentStatus = getPaymentStatusBreakdown(tenants);

  // Determine net income color
  const netIncomeColor = netIncome >= 0 ? '#10B981' : '#EF4444';
  const netIncomeBackground = netIncome >= 0 ? '#D1FAE5' : '#FEE2E2';

  // Loading State
  if (loading) {
    return (
      <ScreenContainer centered>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </ScreenContainer>
    );
  }

  // Empty State (no data at all)
  if (tenants.length === 0 && expenses.length === 0) {
    return (
      <ScreenContainer centered>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="analytics-outline"
            size={80}
            color={Colors.textTertiary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No data yet</Text>
          <Text style={styles.emptySubtitle}>
            Add tenants and expenses to see analytics
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPadding>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>
            Financial overview and trends
          </Text>
        </View>

        {/* Summary Metrics */}
        <View style={styles.section}>
          <View style={styles.metricRow}>
            <MetricCard
              icon="trending-up-outline"
              value={formatCurrency(totalRevenue)}
              label="Total Revenue"
              iconColor="#10B981"
              iconBackground="#D1FAE5"
            />
            <View style={styles.metricSpacer} />
            <MetricCard
              icon="receipt-outline"
              value={formatCurrency(totalExpenses)}
              label="Total Expenses"
              iconColor="#EF4444"
              iconBackground="#FEE2E2"
            />
          </View>
          <MetricCard
            icon="cash-outline"
            value={formatCurrency(netIncome)}
            label="Net Income"
            iconColor={netIncomeColor}
            iconBackground={netIncomeBackground}
          />
        </View>

        {/* Charts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trends</Text>
          
          <AnalyticsChartCard
            title="Monthly Revenue (Last 6 Months)"
            data={monthlyRevenueData}
            color="#10B981"
          />
          
          <AnalyticsChartCard
            title="Monthly Expenses (Last 6 Months)"
            data={monthlyExpensesData}
            color="#EF4444"
          />
        </View>

        {/* Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breakdown</Text>
          
          {/* Top Expenses */}
          {topExpenses.length > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Top Expenses</Text>
              {topExpenses.map((expense, index) => (
                <AnalyticsBreakdownItem
                  key={expense.id}
                  label={expense.description}
                  value={formatCurrency(expense.amount)}
                  color={Colors.error}
                  isLast={index === topExpenses.length - 1}
                />
              ))}
            </View>
          )}

          {/* Payment Status */}
          {tenants.length > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Payment Status</Text>
              <AnalyticsBreakdownItem
                label="Paid"
                value={paymentStatus.paid}
                color="#10B981"
              />
              <AnalyticsBreakdownItem
                label="Pending"
                value={paymentStatus.pending}
                color="#F59E0B"
              />
              <AnalyticsBreakdownItem
                label="Overdue"
                value={paymentStatus.overdue}
                color="#EF4444"
                isLast
              />
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
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
  },
  header: {
    marginBottom: Spacing.lg,
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  metricSpacer: {
    width: Spacing.md,
  },
  breakdownCard: {
    ...CardStyles.elevated,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  breakdownTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});


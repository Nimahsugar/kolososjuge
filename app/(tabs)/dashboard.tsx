import { MetricCard } from '@/components/MetricCard';
import { RecentActivityItem } from '@/components/RecentActivityItem';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Expense, Tenant } from '@/types/models';
import {
    calculateTotalExpenses,
    formatCurrency,
} from '@/utils/analytics';
import {
    calculateMonthlyRevenue,
    calculatePendingPayments,
    calculateTotalTenants,
    DashboardActivity,
    getRecentActivities,
} from '@/utils/dashboard';
import { getExpenses, getTenants } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

/**
 * Dashboard Screen - Main landing screen
 * Shows overview metrics, recent activity, and quick actions
 * 
 * Implementation: Phase 6
 */
export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [tenantsData, expensesData] = await Promise.all([
        getTenants(),
        getExpenses(),
      ]);
      
      setTenants(tenantsData);
      setExpenses(expensesData);
      
      // Get recent activities
      const recentActivities = getRecentActivities(tenantsData, expensesData, 5);
      setActivities(recentActivities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTenant = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/tenants/add');
  };

  const handleAddExpense = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/expenses/add');
  };

  // Calculate metrics
  const totalTenants = calculateTotalTenants(tenants);
  const pendingPayments = calculatePendingPayments(tenants);
  const monthlyRevenue = calculateMonthlyRevenue(tenants);
  const totalExpenses = calculateTotalExpenses(expenses);

  // Loading State
  if (loading) {
    return (
      <ScreenContainer centered>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPadding>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.dateText}>
              {format(new Date(), 'EEEE, MMMM dd, yyyy')}
            </Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <MetricCard
              icon="people-outline"
              value={totalTenants}
              label="Total Tenants"
              iconColor={Colors.primary}
              iconBackground={Colors.primaryLight}
            />
            <View style={styles.metricSpacer} />
            <MetricCard
              icon="time-outline"
              value={pendingPayments}
              label="Pending Payments"
              iconColor="#F59E0B"
              iconBackground="#FEF3C7"
            />
          </View>
          <View style={styles.metricRow}>
            <MetricCard
              icon="trending-up-outline"
              value={formatCurrency(monthlyRevenue)}
              label="Monthly Revenue"
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
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          
          {activities.length > 0 ? (
            <View style={styles.activityList}>
              {activities.map((activity) => (
                <RecentActivityItem
                  key={activity.id}
                  type={activity.type}
                  description={activity.description}
                  date={activity.date}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyActivity}>
              <Ionicons
                name="calendar-outline"
                size={40}
                color={Colors.textTertiary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>No recent activity</Text>
              <Text style={styles.emptySubtext}>
                Your recent actions will appear here
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <ThemedButton
              title="Add Tenant"
              onPress={handleAddTenant}
              variant="primary"
              style={styles.actionButton}
            />
            <ThemedButton
              title="Add Expense"
              onPress={handleAddExpense}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Bottom spacing for scroll */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  dateText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  metricsGrid: {
    marginBottom: Spacing.lg,
  },
  metricRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  metricSpacer: {
    width: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  activityList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
  },
  emptyActivity: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  quickActions: {
    gap: Spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

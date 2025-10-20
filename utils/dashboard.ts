/**
 * Dashboard Calculation Utilities
 * Helper functions for computing dashboard metrics
 */

import { Expense, Tenant } from '@/types/models';

/**
 * Activity item for recent activity section
 */
export interface DashboardActivity {
  id: string;
  type: 'tenant' | 'expense';
  description: string;
  date: string; // ISO date string
}

/**
 * Calculate total number of tenants
 */
export function calculateTotalTenants(tenants: Tenant[]): number {
  return tenants.length;
}

/**
 * Calculate pending payments count
 * (tenants with 'pending' or 'overdue' payment status)
 */
export function calculatePendingPayments(tenants: Tenant[]): number {
  return tenants.filter(
    (tenant) => tenant.paymentStatus === 'pending' || tenant.paymentStatus === 'overdue'
  ).length;
}

/**
 * Calculate this month's revenue
 * Sum of rent amounts for all tenants (assuming monthly rent)
 */
export function calculateMonthlyRevenue(tenants: Tenant[]): number {
  return tenants.reduce((total, tenant) => total + tenant.rentAmount, 0);
}

/**
 * Get recent activities (combined tenants and expenses)
 * Returns last N items sorted by creation date
 */
export function getRecentActivities(
  tenants: Tenant[],
  expenses: Expense[],
  limit: number = 5
): DashboardActivity[] {
  // Convert tenants to activities
  const tenantActivities: DashboardActivity[] = tenants.map((tenant) => ({
    id: tenant.id,
    type: 'tenant' as const,
    description: `Added ${tenant.name} as tenant`,
    date: tenant.createdAt,
  }));

  // Convert expenses to activities
  const expenseActivities: DashboardActivity[] = expenses.map((expense) => ({
    id: expense.id,
    type: 'expense' as const,
    description: `Logged expense: ${expense.description}`,
    date: expense.createdAt,
  }));

  // Combine and sort by date (newest first)
  const allActivities = [...tenantActivities, ...expenseActivities];
  allActivities.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Return limited results
  return allActivities.slice(0, limit);
}


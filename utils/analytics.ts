/**
 * Analytics Calculation Utilities
 * Helper functions for computing analytics metrics and data
 */

import { Expense, Tenant } from '@/types/models';
import { format, parseISO, subMonths } from 'date-fns';

/**
 * Monthly data point for charts
 */
export interface MonthlyData {
  month: string;
  value: number;
  label: string; // Short label like "Jan", "Feb"
}

/**
 * Expense breakdown item
 */
export interface ExpenseBreakdownItem {
  id: string;
  description: string;
  amount: number;
  category: string;
}

/**
 * Payment status breakdown
 */
export interface PaymentStatusBreakdown {
  paid: number;
  pending: number;
  overdue: number;
}

/**
 * Calculate total revenue from all tenants
 * Sum of all tenant rent amounts
 */
export function calculateTotalRevenue(tenants: Tenant[]): number {
  return tenants.reduce((total, tenant) => total + tenant.rentAmount, 0);
}

/**
 * Calculate total expenses
 * Sum of all expense amounts
 */
export function calculateTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

/**
 * Calculate net income
 * Revenue minus expenses
 */
export function calculateNetIncome(
  revenue: number,
  expenses: number
): number {
  return revenue - expenses;
}

/**
 * Get monthly revenue data for last N months
 * Assumes monthly rent from all tenants
 */
export function getMonthlyRevenueData(
  tenants: Tenant[],
  monthsCount: number = 6
): MonthlyData[] {
  const monthlyData: MonthlyData[] = [];
  const monthlyRevenue = calculateTotalRevenue(tenants);

  // Generate data for last N months
  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    monthlyData.push({
      month: format(date, 'yyyy-MM'),
      label: format(date, 'MMM'),
      value: monthlyRevenue,
    });
  }

  return monthlyData;
}

/**
 * Get monthly expenses data for last N months
 * Groups expenses by month
 */
export function getMonthlyExpensesData(
  expenses: Expense[],
  monthsCount: number = 6
): MonthlyData[] {
  const monthlyData: MonthlyData[] = [];

  // Initialize all months with 0
  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    monthlyData.push({
      month: format(date, 'yyyy-MM'),
      label: format(date, 'MMM'),
      value: 0,
    });
  }

  // Group expenses by month
  expenses.forEach((expense) => {
    try {
      const expenseDate = parseISO(expense.date);
      const expenseMonth = format(expenseDate, 'yyyy-MM');

      // Find the matching month in our data
      const monthIndex = monthlyData.findIndex(
        (data) => data.month === expenseMonth
      );

      if (monthIndex !== -1) {
        monthlyData[monthIndex].value += expense.amount;
      }
    } catch (error) {
      console.error('Error parsing expense date:', error);
    }
  });

  return monthlyData;
}

/**
 * Get top N highest expenses
 */
export function getTopExpenses(
  expenses: Expense[],
  limit: number = 5
): ExpenseBreakdownItem[] {
  // Sort by amount (highest first)
  const sorted = [...expenses].sort((a, b) => b.amount - a.amount);

  // Take top N and map to breakdown items
  return sorted.slice(0, limit).map((expense) => ({
    id: expense.id,
    description: expense.description,
    amount: expense.amount,
    category: expense.category,
  }));
}

/**
 * Get payment status breakdown
 * Count of tenants in each payment status
 */
export function getPaymentStatusBreakdown(
  tenants: Tenant[]
): PaymentStatusBreakdown {
  return tenants.reduce(
    (breakdown, tenant) => {
      if (tenant.paymentStatus === 'paid') {
        breakdown.paid += 1;
      } else if (tenant.paymentStatus === 'pending') {
        breakdown.pending += 1;
      } else if (tenant.paymentStatus === 'overdue') {
        breakdown.overdue += 1;
      }
      return breakdown;
    },
    { paid: 0, pending: 0, overdue: 0 }
  );
}

/**
 * Format currency for display (Nigerian Naira)
 */
export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


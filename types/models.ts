/**
 * Data Models for Rent Flow HQ
 * TypeScript interfaces for all data entities
 */

/**
 * Tenant Model
 * Represents a tenant/renter in the system
 */
export interface Tenant {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  propertyAddress: string;
  unitNumber?: string;
  rentAmount: number;
  dueDate?: string; // ISO date string
  paymentStatus: 'paid' | 'pending' | 'overdue';
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Expense Model
 * Represents a property-related expense
 */
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date string
  isPaid: boolean;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Expense Categories
 * Predefined categories for expenses
 */
export type ExpenseCategory =
  | 'maintenance'
  | 'repairs'
  | 'utilities'
  | 'insurance'
  | 'taxes'
  | 'supplies'
  | 'other';

/**
 * Artisan Model
 * Represents a service provider/contractor contact
 */
export interface Artisan {
  id: string;
  name: string;
  trade: string; // e.g., Plumber, Electrician, Painter
  phoneNumber: string;
  email?: string;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Form Data Types (for forms without full model fields)
 */
export type TenantFormData = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>;
export type ExpenseFormData = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
export type ArtisanFormData = Omit<Artisan, 'id' | 'createdAt' | 'updatedAt'>;


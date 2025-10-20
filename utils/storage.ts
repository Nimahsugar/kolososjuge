/**
 * AsyncStorage Helper Functions
 * Data persistence utilities for Rent Flow HQ
 */

import { Artisan, Expense, Tenant } from '@/types/models';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  TENANTS: '@RentFlowHQ:tenants',
  EXPENSES: '@RentFlowHQ:expenses',
  ARTISANS: '@RentFlowHQ:artisans',
} as const;

/**
 * Generic storage helper to reduce code duplication
 */
async function getData<T>(key: string): Promise<T[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
}

async function saveData<T>(key: string, data: T[]): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
}

// ============================================================================
// TENANT FUNCTIONS
// ============================================================================

/**
 * Get all tenants from AsyncStorage
 */
export async function getTenants(): Promise<Tenant[]> {
  return getData<Tenant>(STORAGE_KEYS.TENANTS);
}

/**
 * Save tenants to AsyncStorage
 */
export async function saveTenants(tenants: Tenant[]): Promise<boolean> {
  return saveData(STORAGE_KEYS.TENANTS, tenants);
}

/**
 * Get a single tenant by ID
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
  const tenants = await getTenants();
  return tenants.find((tenant) => tenant.id === id) || null;
}

/**
 * Add a new tenant
 */
export async function addTenant(tenant: Tenant): Promise<boolean> {
  const tenants = await getTenants();
  tenants.push(tenant);
  return saveTenants(tenants);
}

/**
 * Update an existing tenant
 */
export async function updateTenant(
  id: string,
  updates: Partial<Tenant>
): Promise<boolean> {
  const tenants = await getTenants();
  const index = tenants.findIndex((tenant) => tenant.id === id);

  if (index === -1) return false;

  tenants[index] = {
    ...tenants[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return saveTenants(tenants);
}

/**
 * Delete a tenant
 */
export async function deleteTenant(id: string): Promise<boolean> {
  const tenants = await getTenants();
  const filtered = tenants.filter((tenant) => tenant.id !== id);
  return saveTenants(filtered);
}

// ============================================================================
// EXPENSE FUNCTIONS
// ============================================================================

/**
 * Get all expenses from AsyncStorage
 */
export async function getExpenses(): Promise<Expense[]> {
  return getData<Expense>(STORAGE_KEYS.EXPENSES);
}

/**
 * Save expenses to AsyncStorage
 */
export async function saveExpenses(expenses: Expense[]): Promise<boolean> {
  return saveData(STORAGE_KEYS.EXPENSES, expenses);
}

/**
 * Get a single expense by ID
 */
export async function getExpenseById(id: string): Promise<Expense | null> {
  const expenses = await getExpenses();
  return expenses.find((expense) => expense.id === id) || null;
}

/**
 * Add a new expense
 */
export async function addExpense(expense: Expense): Promise<boolean> {
  const expenses = await getExpenses();
  expenses.push(expense);
  return saveExpenses(expenses);
}

/**
 * Update an existing expense
 */
export async function updateExpense(
  id: string,
  updates: Partial<Expense>
): Promise<boolean> {
  const expenses = await getExpenses();
  const index = expenses.findIndex((expense) => expense.id === id);

  if (index === -1) return false;

  expenses[index] = {
    ...expenses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return saveExpenses(expenses);
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: string): Promise<boolean> {
  const expenses = await getExpenses();
  const filtered = expenses.filter((expense) => expense.id !== id);
  return saveExpenses(filtered);
}

// ============================================================================
// ARTISAN FUNCTIONS
// ============================================================================

/**
 * Get all artisans from AsyncStorage
 */
export async function getArtisans(): Promise<Artisan[]> {
  return getData<Artisan>(STORAGE_KEYS.ARTISANS);
}

/**
 * Save artisans to AsyncStorage
 */
export async function saveArtisans(artisans: Artisan[]): Promise<boolean> {
  return saveData(STORAGE_KEYS.ARTISANS, artisans);
}

/**
 * Get a single artisan by ID
 */
export async function getArtisanById(id: string): Promise<Artisan | null> {
  const artisans = await getArtisans();
  return artisans.find((artisan) => artisan.id === id) || null;
}

/**
 * Add a new artisan
 */
export async function addArtisan(artisan: Artisan): Promise<boolean> {
  const artisans = await getArtisans();
  artisans.push(artisan);
  return saveArtisans(artisans);
}

/**
 * Update an existing artisan
 */
export async function updateArtisan(
  id: string,
  updates: Partial<Artisan>
): Promise<boolean> {
  const artisans = await getArtisans();
  const index = artisans.findIndex((artisan) => artisan.id === id);

  if (index === -1) return false;

  artisans[index] = {
    ...artisans[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return saveArtisans(artisans);
}

/**
 * Delete an artisan
 */
export async function deleteArtisan(id: string): Promise<boolean> {
  const artisans = await getArtisans();
  const filtered = artisans.filter((artisan) => artisan.id !== id);
  return saveArtisans(filtered);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear all app data (useful for testing/reset)
 */
export async function clearAllData(): Promise<boolean> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TENANTS,
      STORAGE_KEYS.EXPENSES,
      STORAGE_KEYS.ARTISANS,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}

/**
 * Generate a unique ID for new records
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}


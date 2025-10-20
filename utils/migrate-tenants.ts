/**
 * Data Migration Utility for Tenants
 * Ensures all tenants have required fields including paymentStatus
 */

import { Tenant } from '@/types/models';
import { getTenants, saveTenants } from './storage';

/**
 * Migrate tenants to ensure all required fields are present
 * Adds default paymentStatus of 'pending' if missing
 */
export async function migrateTenants(): Promise<{
  success: boolean;
  migratedCount: number;
  totalCount: number;
}> {
  try {
    const tenants = await getTenants();
    let migratedCount = 0;

    const migratedTenants = tenants.map((tenant) => {
      let needsMigration = false;

      // Check if paymentStatus is missing or invalid
      if (
        !tenant.paymentStatus ||
        !['paid', 'pending', 'overdue'].includes(tenant.paymentStatus)
      ) {
        needsMigration = true;
      }

      if (needsMigration) {
        migratedCount++;
        return {
          ...tenant,
          paymentStatus: (tenant.paymentStatus as Tenant['paymentStatus']) || 'pending',
          updatedAt: new Date().toISOString(),
        };
      }

      return tenant;
    });

    // Save if any migrations were needed
    if (migratedCount > 0) {
      await saveTenants(migratedTenants);
    }

    return {
      success: true,
      migratedCount,
      totalCount: tenants.length,
    };
  } catch (error) {
    console.error('Error migrating tenants:', error);
    return {
      success: false,
      migratedCount: 0,
      totalCount: 0,
    };
  }
}

/**
 * Check if any tenants need migration
 */
export async function checkTenantsMigration(): Promise<boolean> {
  try {
    const tenants = await getTenants();
    
    return tenants.some((tenant) => {
      return (
        !tenant.paymentStatus ||
        !['paid', 'pending', 'overdue'].includes(tenant.paymentStatus)
      );
    });
  } catch (error) {
    console.error('Error checking tenants migration:', error);
    return false;
  }
}

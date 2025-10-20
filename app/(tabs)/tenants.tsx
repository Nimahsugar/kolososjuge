import { ScreenContainer } from '@/components/ScreenContainer';
import { TenantListItem } from '@/components/TenantListItem';
import { Colors, FABStyles, Spacing, Typography } from '@/constants/theme';
import { Tenant } from '@/types/models';
import { getTenants } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Tenants Screen - List of all tenants
 * Shows tenant cards with payment status and quick actions
 * 
 * Implementation: Phase 3, Step 1
 * Phase 9: Performance optimizations - useCallback for renderItem and keyExtractor
 */
export default function TenantsScreen() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tenants when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTenants();
    }, [])
  );

  const loadTenants = async () => {
    try {
      setLoading(true);
      const data = await getTenants();
      // Sort by name alphabetically
      const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
      setTenants(sorted);
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantPress = useCallback((tenantId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/tenants/${tenantId}` as any);
  }, [router]);

  const handleAddTenant = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/tenants/add');
  }, [router]);

  // Memoized render functions for FlatList performance
  // Must be defined before any conditional returns to follow Rules of Hooks
  const renderItem = useCallback(({ item }: { item: Tenant }) => (
    <TenantListItem tenant={item} onPress={handleTenantPress} />
  ), [handleTenantPress]);

  const keyExtractor = useCallback((item: Tenant) => item.id, []);

  const ListHeaderComponent = useCallback(() => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Tenants</Text>
      <Text style={styles.headerSubtitle}>
        Manage your property tenants
      </Text>
    </View>
  ), []);

  // Loading State
  if (loading) {
    return (
      <ScreenContainer centered>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading tenants...</Text>
      </ScreenContainer>
    );
  }

  // Empty State
  if (tenants.length === 0) {
    return (
      <ScreenContainer centered>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="people-outline"
            size={80}
            color={Colors.textTertiary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No tenants yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first tenant to get started
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddTenant}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={styles.emptyButtonText}>Add Tenant</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // List View
  return (
    <ScreenContainer noPadding>
      <FlatList
        data={tenants}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
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
        onPress={handleAddTenant}
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


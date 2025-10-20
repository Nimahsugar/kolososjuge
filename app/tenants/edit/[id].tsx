import { ScreenContainer } from '@/components/ScreenContainer';
import { TenantForm } from '@/components/forms/TenantForm';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Tenant, TenantFormData } from '@/types/models';
import { getTenantById, updateTenant } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';

/**
 * Edit Tenant Screen
 * Form to update existing tenant information
 * 
 * Implementation: Phase 3, Step 4
 */
export default function EditTenantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenant();
  }, [id]);

  const loadTenant = async () => {
    try {
      setLoading(true);
      const data = await getTenantById(id);
      setTenant(data);
    } catch (error) {
      console.error('Error loading tenant:', error);
      Alert.alert('Error', 'Failed to load tenant details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: TenantFormData) => {
    if (!tenant) return;

    try {
      const success = await updateTenant(tenant.id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success',
          'Tenant updated successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Failed to update tenant');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to update tenant. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Edit Tenant',
            headerShown: true,
          }}
        />
        <ScreenContainer centered edges={['left', 'right']}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading tenant...</Text>
        </ScreenContainer>
      </>
    );
  }

  if (!tenant) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Edit Tenant',
            headerShown: true,
          }}
        />
        <ScreenContainer centered edges={['left', 'right']}>
          <Text style={styles.errorText}>Tenant not found</Text>
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Tenant',
          headerShown: true,
        }}
      />
      <ScreenContainer scrollable noPadding edges={['left', 'right']}>
        <TenantForm
          initialData={tenant}
          onSubmit={handleSubmit}
          submitLabel="Update Tenant"
          isEdit
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
});


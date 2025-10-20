import { ScreenContainer } from '@/components/ScreenContainer';
import { TenantForm } from '@/components/forms/TenantForm';
import { TenantFormData } from '@/types/models';
import { addTenant, generateId } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

/**
 * Add Tenant Screen
 * Form to create a new tenant
 * 
 * Implementation: Phase 3, Step 2
 */
export default function AddTenantScreen() {
  const router = useRouter();

  const handleSubmit = async (data: TenantFormData) => {
    try {
      const newTenant = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const success = await addTenant(newTenant);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success',
          'Tenant added successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Failed to save tenant');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to add tenant. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Tenant',
          headerShown: true,
        }}
      />
      <ScreenContainer scrollable noPadding edges={['left', 'right']}>
        <TenantForm onSubmit={handleSubmit} submitLabel="Add Tenant" />
      </ScreenContainer>
    </>
  );
}


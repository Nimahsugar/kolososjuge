import { ArtisanForm } from '@/components/forms/ArtisanForm';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ArtisanFormData } from '@/types/models';
import { addArtisan, generateId } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

/**
 * Add Artisan Screen
 * Form to create a new artisan contact
 * 
 * Implementation: Phase 5, Step 2
 */
export default function AddArtisanScreen() {
  const router = useRouter();

  const handleSubmit = async (data: ArtisanFormData) => {
    try {
      const newArtisan = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const success = await addArtisan(newArtisan);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success',
          'Contact added successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Failed to save contact');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to add contact. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Contact',
          headerShown: true,
        }}
      />
      <ScreenContainer scrollable noPadding edges={['left', 'right']}>
        <ArtisanForm onSubmit={handleSubmit} submitLabel="Add Contact" />
      </ScreenContainer>
    </>
  );
}


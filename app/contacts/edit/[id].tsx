import { ConfirmModal } from '@/components/ConfirmModal';
import { ArtisanForm } from '@/components/forms/ArtisanForm';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors, Spacing } from '@/constants/theme';
import { Artisan, ArtisanFormData } from '@/types/models';
import { deleteArtisan, getArtisanById, updateArtisan } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

/**
 * Edit Artisan Screen
 * Form to update existing artisan contact
 * 
 * Implementation: Phase 5, Step 3
 */
export default function EditArtisanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadArtisan();
  }, [id]);

  const loadArtisan = async () => {
    try {
      setLoading(true);
      const data = await getArtisanById(id);
      if (data) {
        setArtisan(data);
      } else {
        Alert.alert('Error', 'Contact not found', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Error loading artisan:', error);
      Alert.alert('Error', 'Failed to load contact', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ArtisanFormData) => {
    try {
      const success = await updateArtisan(id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success',
          'Contact updated successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Failed to update contact');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to update contact. Please try again.');
    }
  };

  const handleDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteArtisan(id);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowDeleteModal(false);
        Alert.alert(
          'Deleted',
          'Contact deleted successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to delete contact. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Edit Contact',
            headerShown: true,
          }}
        />
        <ScreenContainer centered edges={['left', 'right']}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </ScreenContainer>
      </>
    );
  }

  if (!artisan) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Contact',
          headerShown: true,
        }}
      />
      <ScreenContainer scrollable noPadding edges={['left', 'right']}>
        <ArtisanForm
          initialData={artisan}
          onSubmit={handleSubmit}
          submitLabel="Update Contact"
          isEdit
        />

        {/* Delete Button */}
        <View style={styles.deleteContainer}>
          <ThemedButton
            title="Delete Contact"
            onPress={handleDeletePress}
            variant="dangerOutlined"
          />
        </View>
      </ScreenContainer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Contact?"
        message="This action cannot be undone. Are you sure you want to delete this contact?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isDestructive
        loading={isDeleting}
      />
    </>
  );
}

const styles = StyleSheet.create({
  deleteContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
});


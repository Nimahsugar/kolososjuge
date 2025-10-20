import { ConfirmModal } from '@/components/ConfirmModal';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors, Spacing } from '@/constants/theme';
import { Expense, ExpenseFormData } from '@/types/models';
import { deleteExpense, getExpenseById, updateExpense } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

/**
 * Edit Expense Screen
 * Form to update existing expense
 * 
 * Implementation: Phase 4, Step 3
 */
export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadExpense();
  }, [id]);

  const loadExpense = async () => {
    try {
      setLoading(true);
      const data = await getExpenseById(id);
      if (data) {
        setExpense(data);
      } else {
        Alert.alert('Error', 'Expense not found', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Error loading expense:', error);
      Alert.alert('Error', 'Failed to load expense', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      const success = await updateExpense(id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success',
          'Expense updated successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Failed to update expense');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to update expense. Please try again.');
    }
  };

  const handleDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteExpense(id);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowDeleteModal(false);
        Alert.alert(
          'Deleted',
          'Expense deleted successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Failed to delete expense');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to delete expense. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Edit Expense',
            headerShown: true,
          }}
        />
        <ScreenContainer centered edges={['left', 'right']}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </ScreenContainer>
      </>
    );
  }

  if (!expense) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Expense',
          headerShown: true,
        }}
      />
      <ScreenContainer scrollable noPadding edges={['left', 'right']}>
        <ExpenseForm
          initialData={expense}
          onSubmit={handleSubmit}
          submitLabel="Update Expense"
          isEdit
        />

        {/* Delete Button */}
        <View style={styles.deleteContainer}>
          <ThemedButton
            title="Delete Expense"
            onPress={handleDeletePress}
            variant="dangerOutlined"
          />
        </View>
      </ScreenContainer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Expense?"
        message="This action cannot be undone. Are you sure you want to delete this expense?"
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


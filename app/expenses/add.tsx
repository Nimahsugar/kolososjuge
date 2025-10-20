import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ExpenseFormData } from '@/types/models';
import { addExpense, generateId } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

/**
 * Add Expense Screen
 * Form to create a new expense
 * 
 * Implementation: Phase 4, Step 2
 */
export default function AddExpenseScreen() {
  const router = useRouter();

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      const newExpense = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const success = await addExpense(newExpense);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success',
          'Expense added successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Failed to save expense');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Expense',
          headerShown: true,
        }}
      />
      <ScreenContainer scrollable noPadding edges={['left', 'right']}>
        <ExpenseForm onSubmit={handleSubmit} submitLabel="Add Expense" />
      </ScreenContainer>
    </>
  );
}


import { Colors, Spacing, Typography } from '@/constants/theme';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { z } from 'zod';
import { DatePickerModal } from '../DatePickerModal';
import { ThemedButton } from '../ThemedButton';
import { ThemedInput } from '../ThemedInput';

// Validation Schema
const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200, 'Description is too long'),
  amount: z.string().min(1, 'Amount is required'),
  category: z.enum(['maintenance', 'repairs', 'utilities', 'insurance', 'taxes', 'supplies', 'other']),
  date: z.string().min(1, 'Date is required'),
  isPaid: z.boolean(),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  submitLabel?: string;
  isEdit?: boolean;
}

/**
 * ExpenseForm - Reusable form component for adding/editing expenses
 * Handles validation, date selection, category picker, and form submission
 * 
 * @example
 * // Add mode
 * <ExpenseForm
 *   onSubmit={handleAddExpense}
 *   submitLabel="Add Expense"
 * />
 * 
 * @example
 * // Edit mode
 * <ExpenseForm
 *   initialData={existingExpense}
 *   onSubmit={handleUpdateExpense}
 *   submitLabel="Update Expense"
 *   isEdit
 * />
 */
export function ExpenseForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  isEdit = false,
}: ExpenseFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    mode: 'onChange',
    defaultValues: {
      description: initialData?.description || '',
      amount: initialData?.amount?.toString() || '',
      category: initialData?.category || 'other',
      date: initialData?.date || new Date().toISOString(),
      isPaid: initialData?.isPaid || false,
      notes: initialData?.notes || '',
    },
  });

  const date = watch('date');
  const isPaid = watch('isPaid');
  const category = watch('category');

  const handleDateConfirm = (selectedDate: Date) => {
    setSelectedDate(selectedDate);
    setValue('date', selectedDate.toISOString(), { shouldValidate: true });
    setShowDatePicker(false);
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const onFormSubmit = async (data: ExpenseFormValues) => {
    try {
      setIsSubmitting(true);

      const formData: ExpenseFormData = {
        description: data.description.trim(),
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date,
        isPaid: data.isPaid,
        notes: data.notes?.trim() || undefined,
      };

      await onSubmit(formData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense Details</Text>

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Description"
              required
              placeholder="e.g., Plumbing repair"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              autoCapitalize="sentences"
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Amount"
              required
              placeholder="0.00"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.amount?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Date *</Text>
          <ThemedButton
            title={formatDisplayDate(date)}
            onPress={() => setShowDatePicker(true)}
            variant="outlined"
          />
          {errors.date && (
            <Text style={styles.errorText}>{errors.date.message}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        
        <CategorySelector
          selectedCategory={category}
          onSelect={(cat) => setValue('category', cat, { shouldValidate: true })}
        />
        {errors.category && (
          <Text style={styles.errorText}>{errors.category.message}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Status</Text>
        
        <Controller
          control={control}
          name="isPaid"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <View style={styles.switchLabelContainer}>
                <Text style={styles.switchLabel}>
                  Mark as {value ? 'Paid' : 'Unpaid'}
                </Text>
                <Text style={styles.switchHelper}>
                  {value 
                    ? 'This expense has been paid'
                    : 'This expense is pending payment'
                  }
                </Text>
              </View>
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ 
                  false: Colors.gray200, 
                  true: Colors.successLight 
                }}
                thumbColor={value ? Colors.success : Colors.textTertiary}
              />
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Notes"
              placeholder="Add any additional details..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.notes?.message}
              multiline
              numberOfLines={4}
            />
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          title={submitLabel}
          onPress={handleSubmit(onFormSubmit)}
          variant="primary"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
        />
      </View>

      <DatePickerModal
        visible={showDatePicker}
        date={selectedDate}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        title="Select Expense Date"
      />
    </ScrollView>
  );
}

// Category Selector Component
interface CategorySelectorProps {
  selectedCategory: ExpenseCategory;
  onSelect: (category: ExpenseCategory) => void;
}

function CategorySelector({ selectedCategory, onSelect }: CategorySelectorProps) {
  const categories: Array<{ value: ExpenseCategory; label: string; icon: string }> = [
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'repairs', label: 'Repairs', icon: '🔨' },
    { value: 'utilities', label: 'Utilities', icon: '💡' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️' },
    { value: 'taxes', label: 'Taxes', icon: '📄' },
    { value: 'supplies', label: 'Supplies', icon: '🛒' },
    { value: 'other', label: 'Other', icon: '📦' },
  ];

  return (
    <View style={styles.categoryGrid}>
      {categories.map((cat) => (
        <ThemedButton
          key={cat.value}
          title={`${cat.icon} ${cat.label}`}
          onPress={() => onSelect(cat.value)}
          variant={selectedCategory === cat.value ? 'primary' : 'outlined'}
          size="small"
          style={styles.categoryButton}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  datePickerContainer: {
    marginBottom: Spacing.md,
  },
  dateLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    flexBasis: '48%',
    flexGrow: 0,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray100,
    padding: Spacing.md,
    borderRadius: 12,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  switchLabel: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  switchHelper: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});


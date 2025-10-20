import { Colors, Spacing, Typography } from '@/constants/theme';
import { Tenant, TenantFormData } from '@/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { DatePickerModal } from '../DatePickerModal';
import { ThemedButton } from '../ThemedButton';
import { ThemedInput } from '../ThemedInput';

// Validation Schema
const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  propertyAddress: z.string().min(1, 'Property address is required'),
  unitNumber: z.string().optional(),
  rentAmount: z.string().min(1, 'Rent amount is required'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  initialData?: Tenant;
  onSubmit: (data: TenantFormData) => Promise<void>;
  submitLabel?: string;
  isEdit?: boolean;
}

/**
 * TenantForm - Reusable form component for adding/editing tenants
 * Handles validation, date selection, and form submission
 * 
 * @example
 * // Add mode
 * <TenantForm
 *   onSubmit={handleAddTenant}
 *   submitLabel="Add Tenant"
 * />
 * 
 * @example
 * // Edit mode
 * <TenantForm
 *   initialData={existingTenant}
 *   onSubmit={handleUpdateTenant}
 *   submitLabel="Update Tenant"
 *   isEdit
 * />
 */
export function TenantForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  isEdit = false,
}: TenantFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialData?.dueDate ? new Date(initialData.dueDate) : new Date()
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      phoneNumber: initialData?.phoneNumber || '',
      email: initialData?.email || '',
      propertyAddress: initialData?.propertyAddress || '',
      unitNumber: initialData?.unitNumber || '',
      rentAmount: initialData?.rentAmount?.toString() || '',
      dueDate: initialData?.dueDate || '',
      notes: initialData?.notes || '',
    },
  });

  const dueDate = watch('dueDate');

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    setValue('dueDate', date.toISOString(), { shouldValidate: true });
    setShowDatePicker(false);
  };

  const formatDisplayDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const onFormSubmit = async (data: TenantFormValues) => {
    try {
      setIsSubmitting(true);

      const formData: TenantFormData = {
        name: data.name.trim(),
        phoneNumber: data.phoneNumber.trim(),
        email: data.email?.trim() || undefined,
        propertyAddress: data.propertyAddress.trim(),
        unitNumber: data.unitNumber?.trim() || undefined,
        rentAmount: parseFloat(data.rentAmount),
        dueDate: data.dueDate || undefined,
        // Preserve existing payment status when editing, default to 'pending' for new tenants
        paymentStatus: initialData?.paymentStatus || 'pending',
        notes: data.notes?.trim() || undefined,
      };

      await onSubmit(formData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save tenant. Please try again.');
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
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Full Name"
              required
              placeholder="John Doe"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Phone Number"
              required
              placeholder="+1 (555) 123-4567"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phoneNumber?.message}
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Email"
              placeholder="john.doe@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Information</Text>

        <Controller
          control={control}
          name="propertyAddress"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Property Address"
              required
              placeholder="123 Main Street"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.propertyAddress?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="unitNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Unit Number"
              placeholder="Apt 2B"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.unitNumber?.message}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>

        <Controller
          control={control}
          name="rentAmount"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Monthly Rent Amount"
              required
              placeholder="1500.00"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.rentAmount?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>
            Payment Due Date {!isEdit && '(optional)'}
          </Text>
          <ThemedButton
            title={formatDisplayDate(dueDate)}
            onPress={() => setShowDatePicker(true)}
            variant="outlined"
          />
          {errors.dueDate && (
            <Text style={styles.errorText}>{errors.dueDate.message}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Notes"
              placeholder="Additional information..."
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
        title="Select Payment Due Date"
      />
    </ScrollView>
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
  buttonContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});


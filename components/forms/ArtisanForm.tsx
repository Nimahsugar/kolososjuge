import { Colors, Spacing, Typography } from '@/constants/theme';
import { Artisan, ArtisanFormData } from '@/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { ThemedButton } from '../ThemedButton';
import { ThemedInput } from '../ThemedInput';

// Validation Schema
const artisanSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  trade: z.string().min(1, 'Trade/specialty is required').max(100, 'Trade is too long'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  notes: z.string().optional(),
});

type ArtisanFormValues = z.infer<typeof artisanSchema>;

interface ArtisanFormProps {
  initialData?: Artisan;
  onSubmit: (data: ArtisanFormData) => Promise<void>;
  submitLabel?: string;
  isEdit?: boolean;
}

/**
 * ArtisanForm - Reusable form component for adding/editing artisan contacts
 * Handles validation and form submission for service provider contacts
 * 
 * @example
 * // Add mode
 * <ArtisanForm
 *   onSubmit={handleAddArtisan}
 *   submitLabel="Add Contact"
 * />
 * 
 * @example
 * // Edit mode
 * <ArtisanForm
 *   initialData={existingArtisan}
 *   onSubmit={handleUpdateArtisan}
 *   submitLabel="Update Contact"
 *   isEdit
 * />
 */
export function ArtisanForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  isEdit = false,
}: ArtisanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ArtisanFormValues>({
    resolver: zodResolver(artisanSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      trade: initialData?.trade || '',
      phoneNumber: initialData?.phoneNumber || '',
      email: initialData?.email || '',
      notes: initialData?.notes || '',
    },
  });

  const onFormSubmit = async (data: ArtisanFormValues) => {
    try {
      setIsSubmitting(true);

      const formData: ArtisanFormData = {
        name: data.name.trim(),
        trade: data.trade.trim(),
        phoneNumber: data.phoneNumber.trim(),
        email: data.email?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
      };

      await onSubmit(formData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save contact. Please try again.');
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
        <Text style={styles.sectionTitle}>Contact Information</Text>

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
          name="trade"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Trade/Specialty"
              required
              placeholder="e.g., Plumber, Electrician, Painter"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.trade?.message}
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
              placeholder="john@example.com"
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
        <Text style={styles.sectionTitle}>Additional Notes</Text>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              label="Notes"
              placeholder="Additional information about this contact..."
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
  buttonContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});


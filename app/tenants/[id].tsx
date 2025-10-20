import { ConfirmModal } from '@/components/ConfirmModal';
import { DatePickerModal } from '@/components/DatePickerModal';
import { ScreenContainer } from '@/components/ScreenContainer';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { CardStyles, Colors, Spacing, Typography } from '@/constants/theme';
import { Tenant } from '@/types/models';
import { deleteTenant, getTenantById, updateTenant } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Tenant Detail Screen
 * Shows individual tenant information and payment details
 * 
 * Implementation: Phase 3, Step 3
 */
export default function TenantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleSetDueDate = async (date: Date) => {
    if (!tenant) return;

    try {
      const success = await updateTenant(tenant.id, {
        dueDate: date.toISOString(),
      });

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTenant({ ...tenant, dueDate: date.toISOString() });
        setShowDatePicker(false);
        Alert.alert('Success', 'Due date updated successfully');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to update due date');
    }
  };

  const handleMarkAsPaid = async () => {
    if (!tenant) return;

    try {
      const success = await updateTenant(tenant.id, {
        paymentStatus: 'paid',
      });

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTenant({ ...tenant, paymentStatus: 'paid' });
        Alert.alert('Success', 'Payment status updated to Paid');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to update payment status');
    }
  };

  const handleMarkAsPending = async () => {
    if (!tenant) return;

    try {
      const success = await updateTenant(tenant.id, {
        paymentStatus: 'pending',
      });

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTenant({ ...tenant, paymentStatus: 'pending' });
        Alert.alert('Success', 'Payment status updated to Pending');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to update payment status');
    }
  };

  const handleDelete = async () => {
    if (!tenant) return;

    try {
      setDeleting(true);
      const success = await deleteTenant(tenant.id);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowDeleteModal(false);
        Alert.alert('Success', 'Tenant deleted successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to delete tenant');
    } finally {
      setDeleting(false);
    }
  };

  const handleCall = () => {
    if (!tenant?.phoneNumber) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${tenant.phoneNumber}`);
  };

  const handleEmail = () => {
    if (!tenant?.email) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`mailto:${tenant.email}`);
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/tenants/edit/${id}` as any);
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getPropertyDisplay = (): string => {
    if (!tenant) return '';
    const { propertyAddress, unitNumber } = tenant;
    if (unitNumber) {
      return `${propertyAddress}, Unit ${unitNumber}`;
    }
    return propertyAddress;
  };

  if (loading) {
    return (
      <ScreenContainer centered edges={['left', 'right']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading tenant...</Text>
      </ScreenContainer>
    );
  }

  if (!tenant) {
    return (
      <ScreenContainer centered edges={['left', 'right']}>
        <Ionicons name="alert-circle-outline" size={80} color={Colors.error} />
        <Text style={styles.errorText}>Tenant not found</Text>
        <ThemedButton title="Go Back" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: tenant.name,
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScreenContainer scrollable edges={['left', 'right']}>
        {/* Avatar and Name */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(tenant.name)}</Text>
          </View>
          <Text style={styles.name}>{tenant.name}</Text>
          <StatusBadge status={tenant.paymentStatus} style={styles.badge} />
        </View>

        {/* Contact Information */}
        <ThemedCard variant="section">
          <Text style={CardStyles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
            <View style={styles.infoLeft}>
              <Ionicons name="call-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Phone</Text>
            </View>
            <Text style={styles.infoValue}>{tenant.phoneNumber}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>

          {tenant.email && (
            <TouchableOpacity style={styles.infoRow} onPress={handleEmail}>
              <View style={styles.infoLeft}>
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                <Text style={styles.infoLabel}>Email</Text>
              </View>
              <Text style={styles.infoValue} numberOfLines={1}>{tenant.email}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </ThemedCard>

        {/* Property Information */}
        <ThemedCard variant="section">
          <Text style={CardStyles.sectionTitle}>Property Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="home-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Address</Text>
            </View>
            <Text style={[styles.infoValue, styles.infoValueFlex]} numberOfLines={2}>
              {getPropertyDisplay()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="cash-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Rent Amount</Text>
            </View>
            <Text style={styles.infoValue}>₦{tenant.rentAmount.toFixed(2)}/year</Text>
          </View>
        </ThemedCard>

        {/* Payment Information */}
        <ThemedCard variant="section">
          <Text style={CardStyles.sectionTitle}>Payment Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Due Date</Text>
            </View>
            <Text style={styles.infoValue}>{formatDate(tenant.dueDate)}</Text>
          </View>

          <ThemedButton
            title="Set Due Date"
            onPress={() => setShowDatePicker(true)}
            variant="outlined"
            style={styles.actionButton}
          />

          {/* Payment Status Actions */}
          <View style={styles.paymentStatusSection}>
            <Text style={styles.paymentStatusLabel}>Payment Status</Text>
            <View style={styles.paymentStatusButtons}>
              {tenant.paymentStatus !== 'paid' && (
                <ThemedButton
                  title="Mark as Paid"
                  onPress={handleMarkAsPaid}
                  variant="primary"
                  style={styles.statusButton}
                />
              )}
              {tenant.paymentStatus === 'paid' && (
                <ThemedButton
                  title="Mark as Pending"
                  onPress={handleMarkAsPending}
                  variant="outlined"
                  style={styles.statusButton}
                />
              )}
            </View>
          </View>

          <ThemedButton
            title="Generate Reminder Letter"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/tenants/reminder/${id}` as any);
            }}
            variant="secondary"
            style={styles.actionButton}
          />
        </ThemedCard>

        {/* Notes */}
        {tenant.notes && (
          <ThemedCard variant="section">
            <Text style={CardStyles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{tenant.notes}</Text>
          </ThemedCard>
        )}

        {/* Danger Zone */}
        <ThemedCard variant="section" style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <ThemedButton
            title="Delete Tenant"
            onPress={() => setShowDeleteModal(true)}
            variant="dangerOutlined"
          />
        </ThemedCard>
      </ScreenContainer>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        date={tenant.dueDate ? new Date(tenant.dueDate) : new Date()}
        onConfirm={handleSetDueDate}
        onCancel={() => setShowDatePicker(false)}
        title="Set Payment Due Date"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Tenant"
        message={`Are you sure you want to delete ${tenant.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        variant="danger"
        loading={deleting}
      />
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
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  editButton: {
    padding: Spacing.sm,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    ...Typography.h1,
    color: Colors.primary,
  },
  name: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  badge: {
    marginTop: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  infoValue: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginRight: Spacing.xs,
  },
  infoValueFlex: {
    flex: 1,
    textAlign: 'right',
  },
  actionButton: {
    marginTop: Spacing.sm,
  },
  paymentStatusSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentStatusLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  paymentStatusButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusButton: {
    flex: 1,
  },
  notesText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  dangerZone: {
    borderColor: Colors.errorLight,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  dangerTitle: {
    ...Typography.h5,
    color: Colors.error,
    marginBottom: Spacing.md,
  },
});


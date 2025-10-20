import { ModalStyles } from '@/constants/theme';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { ThemedButton } from './ThemedButton';

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
  loading?: boolean;
  isDestructive?: boolean; // Alias for variant="danger" for backwards compatibility
}

/**
 * ConfirmModal - Reusable confirmation modal
 * Used for delete actions and other confirmations
 * 
 * @example
 * <ConfirmModal
 *   visible={showDelete}
 *   title="Delete Tenant"
 *   message="Are you sure you want to delete this tenant? This action cannot be undone."
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowDelete(false)}
 *   variant="danger"
 * />
 */
export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
  isDestructive = false,
}: ConfirmModalProps) {
  // Use isDestructive as alias for variant="danger"
  const effectiveVariant = isDestructive ? 'danger' : variant;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={ModalStyles.overlay}>
        <View style={ModalStyles.modal}>
          <Text style={ModalStyles.modalTitle}>{title}</Text>
          <Text style={ModalStyles.modalMessage}>{message}</Text>

          <View style={ModalStyles.modalActions}>
            <ThemedButton
              title={cancelText}
              onPress={onCancel}
              variant="outlined"
              style={styles.button}
              disabled={loading}
            />
            <ThemedButton
              title={confirmText}
              onPress={onConfirm}
              variant={effectiveVariant === 'danger' ? 'danger' : 'primary'}
              style={styles.button}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
});


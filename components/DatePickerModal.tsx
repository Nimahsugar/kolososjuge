import { Colors, ModalStyles, Spacing } from '@/constants/theme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { ThemedButton } from './ThemedButton';

interface DatePickerModalProps {
  visible: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  title?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * DatePickerModal - Reusable date picker modal
 * Handles platform differences (iOS/Android) for date selection
 * 
 * @example
 * <DatePickerModal
 *   visible={showDatePicker}
 *   date={selectedDate}
 *   onConfirm={handleDateConfirm}
 *   onCancel={() => setShowDatePicker(false)}
 *   title="Select Due Date"
 * />
 */
export function DatePickerModal({
  visible,
  date,
  onConfirm,
  onCancel,
  title = 'Select Date',
  minimumDate,
  maximumDate,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(date);

  const handleDateChange = (event: DateTimePickerEvent, newDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && newDate) {
        onConfirm(newDate);
      } else {
        onCancel();
      }
    } else if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  // Android shows native date picker
  if (Platform.OS === 'android' && visible) {
    return (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={handleDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    );
  }

  // iOS shows custom modal
  if (Platform.OS === 'ios' && !visible) {
    return null;
  }

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
          
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              textColor={Colors.textPrimary}
            />
          </View>

          <View style={ModalStyles.modalActions}>
            <ThemedButton
              title="Cancel"
              onPress={onCancel}
              variant="outlined"
              style={styles.button}
            />
            <ThemedButton
              title="Confirm"
              onPress={handleConfirm}
              variant="primary"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: Spacing.md,
  },
  button: {
    flex: 1,
  },
});


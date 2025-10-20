import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedInput } from '@/components/ThemedInput';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Tenant } from '@/types/models';
import {
  generateLetterHTML,
  getDefaultMessage,
  getLetterToneConfig,
  LetterTone,
} from '@/utils/letterTemplate';
import { getTenantById } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { shareAsync } from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Reminder Letter Screen
 * Generate and share payment reminder letters
 * 
 * Implementation: Phase 8
 */

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
  headerButton: {
    padding: Spacing.sm,
  },
  tenantCard: {
    marginBottom: Spacing.md,
  },
  tenantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h4,
    color: Colors.primary,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    ...Typography.h5,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  tenantProperty: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  tenantAmount: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  toneContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  toneCard: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  toneIcon: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  toneContent: {
    flex: 1,
  },
  toneLabel: {
    ...Typography.labelSmall,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  toneDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputSpacing: {
    marginBottom: Spacing.md,
  },
  actionsContainer: {
    marginTop: Spacing.md,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
  bottomSpacing: {
    height: Spacing.xl,
  },
});
export default function ReminderLetterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState<LetterTone>('formal');
  const [customMessage, setCustomMessage] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [landlordContact, setLandlordContact] = useState('');

  useEffect(() => {
    loadTenant();
  }, [id]);

  const loadTenant = async () => {
    try {
      setLoading(true);
      const data = await getTenantById(id);
      setTenant(data);
      // Set default message for selected tone
      if (data) {
        setCustomMessage(getDefaultMessage(selectedTone, data.name));
      }
    } catch (error) {
      console.error('Error loading tenant:', error);
      Alert.alert('Error', 'Failed to load tenant details');
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = (tone: LetterTone) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTone(tone);
    if (tenant) {
      setCustomMessage(getDefaultMessage(tone, tenant.name));
    }
  };

  const handleGeneratePDF = async () => {
    if (!tenant) return;

    try {
      setGenerating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const html = generateLetterHTML({
        tenant,
        customMessage,
        tone: selectedTone,
        landlordName,
        landlordContact,
      });

      const { uri } = await Print.printToFileAsync({ html });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Share the PDF
      await shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to generate or share PDF');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!tenant) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const html = generateLetterHTML({
        tenant,
        customMessage,
        tone: selectedTone,
        landlordName,
        landlordContact,
      });

      await Print.printAsync({ html });
    } catch (error) {
      console.error('Error previewing letter:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to preview letter');
    }
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

  const tones: LetterTone[] = ['friendly', 'formal', 'urgent'];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Payment Reminder',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleGeneratePDF}
              style={styles.headerButton}
              disabled={generating}
            >
              {generating ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Ionicons name="share-outline" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <ScreenContainer scrollable edges={['left', 'right']}>
        {/* Tenant Info Summary */}
        <ThemedCard variant="elevated" style={styles.tenantCard}>
          <View style={styles.tenantHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {tenant.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.tenantInfo}>
              <Text style={styles.tenantName}>{tenant.name}</Text>
              <Text style={styles.tenantProperty}>
                {tenant.unitNumber
                  ? `${tenant.propertyAddress}, Unit ${tenant.unitNumber}`
                  : tenant.propertyAddress}
              </Text>
              <Text style={styles.tenantAmount}>
                ₦{tenant.rentAmount.toFixed(2)}/year
              </Text>
            </View>
          </View>
        </ThemedCard>

        {/* Letter Tone Selection */}
        <ThemedCard variant="section">
          <Text style={styles.sectionTitle}>Select Tone</Text>
          <Text style={styles.sectionDescription}>
            Choose the tone of your reminder letter
          </Text>
          <View style={styles.toneContainer}>
            {tones.map((tone) => {
              const config = getLetterToneConfig(tone);
              const isSelected = selectedTone === tone;
              return (
                <TouchableOpacity
                  key={tone}
                  style={[
                    styles.toneCard,
                    isSelected && { borderColor: config.color, borderWidth: 2 },
                  ]}
                  onPress={() => handleToneChange(tone)}
                >
                  <View style={styles.toneIcon}>
                    <Ionicons
                      name={config.icon}
                      size={28}
                      color={isSelected ? config.color : Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.toneContent}>
                    <Text
                      style={[
                        styles.toneLabel,
                        isSelected && { color: config.color, fontWeight: '600' },
                      ]}
                    >
                      {config.label}
                    </Text>
                    <Text style={styles.toneDescription}>{config.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ThemedCard>

        {/* Customize Message */}
        <ThemedCard variant="section">
          <Text style={styles.sectionTitle}>Customize Message</Text>
          <Text style={styles.sectionDescription}>
            Edit the main message of your letter
          </Text>
          <ThemedInput
            label="Message Content"
            value={customMessage}
            onChangeText={setCustomMessage}
            placeholder="Enter your custom message..."
            multiline
            numberOfLines={6}
            style={styles.messageInput}
          />
        </ThemedCard>

        {/* Optional Details */}
        <ThemedCard variant="section">
          <Text style={styles.sectionTitle}>Signature Details (Optional)</Text>
          <ThemedInput
            label="Your Name"
            value={landlordName}
            onChangeText={setLandlordName}
            placeholder="Property Manager"
            style={styles.inputSpacing}
          />
          <ThemedInput
            label="Contact Information"
            value={landlordContact}
            onChangeText={setLandlordContact}
            placeholder="Phone or email"
          />
        </ThemedCard>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <ThemedButton
            title="Preview Letter"
            onPress={handlePreview}
            variant="outlined"
            style={styles.actionButton}
          />
          <ThemedButton
            title="Generate & Share PDF"
            onPress={handleGeneratePDF}
            variant="primary"
            loading={generating}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScreenContainer>
    </>
  );
}

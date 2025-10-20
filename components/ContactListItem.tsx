import { CardStyles, Colors, Spacing, Typography } from '@/constants/theme';
import { Artisan } from '@/types/models';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import React, { useCallback, useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ContactListItemProps {
  artisan: Artisan;
  onPress: (artisanId: string) => void;
}

/**
 * ContactListItem - Individual artisan/contact card for list display
 * Shows name, trade/specialty, phone number, and call button
 * 
 * Performance optimizations:
 * - Memoized with React.memo to prevent unnecessary re-renders
 * - Callbacks memoized with useCallback
 * - Computed values memoized with useMemo
 * 
 * @example
 * <ContactListItem
 *   artisan={artisan}
 *   onPress={(id) => router.push(`/contacts/edit/${id}`)}
 * />
 */
export const ContactListItem = React.memo(function ContactListItem({ artisan, onPress }: ContactListItemProps) {
  const initials = useMemo(() => {
    const parts = artisan.name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [artisan.name]);

  const handlePress = useCallback(() => {
    onPress(artisan.id);
  }, [onPress, artisan.id]);

  const handleCallPress = useCallback(async (e: any) => {
    e.stopPropagation();
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Clean phone number (remove spaces, dashes, etc.)
      const cleanPhoneNumber = artisan.phoneNumber.replace(/[^0-9+]/g, '');
      const phoneUrl = `tel:${cleanPhoneNumber}`;
      
      // Directly open the phone dialer without checking canOpenURL
      // This works more reliably across different Android versions
      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.error('Error opening phone dialer:', error);
      Alert.alert('Error', 'Unable to open phone dialer. Please check if your device supports phone calls.');
    }
  }, [artisan.phoneNumber]);

  return (
    <TouchableOpacity
      style={CardStyles.listItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar Circle */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {artisan.name}
        </Text>
        <Text style={styles.trade} numberOfLines={1}>
          {artisan.trade}
        </Text>
        <Text style={styles.phone}>
          {artisan.phoneNumber}
        </Text>
      </View>

      {/* Call Button */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={handleCallPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="call"
          size={20}
          color={Colors.white}
        />
      </TouchableOpacity>

      {/* Chevron Icon */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={Colors.textTertiary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h5,
    color: Colors.success,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  name: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  trade: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  phone: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  chevron: {
    marginLeft: Spacing.xs,
  },
});


import { ContactListItem } from '@/components/ContactListItem';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Colors, FABStyles, Spacing, Typography } from '@/constants/theme';
import { Artisan } from '@/types/models';
import { getArtisans } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Contacts Screen - Directory of service providers (artisans)
 * Shows contact list with call functionality
 * 
 * Implementation: Phase 5, Step 1
 * Phase 9: Performance optimizations - useCallback for renderItem and keyExtractor
 */
export default function ContactsScreen() {
  const router = useRouter();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  // Load artisans when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadArtisans();
    }, [])
  );

  const loadArtisans = async () => {
    try {
      setLoading(true);
      const data = await getArtisans();
      // Sort by name alphabetically
      const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
      setArtisans(sorted);
    } catch (error) {
      console.error('Error loading artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactPress = useCallback((artisanId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/contacts/edit/${artisanId}` as any);
  }, [router]);

  const handleAddContact = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/contacts/add');
  }, [router]);

  // Memoized render functions for FlatList performance
  // Must be defined before any conditional returns to follow Rules of Hooks
  const renderItem = useCallback(({ item }: { item: Artisan }) => (
    <ContactListItem artisan={item} onPress={handleContactPress} />
  ), [handleContactPress]);

  const keyExtractor = useCallback((item: Artisan) => item.id, []);

  const ListHeaderComponent = useCallback(() => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Contacts</Text>
      <Text style={styles.headerSubtitle}>
        Your service providers directory
      </Text>
    </View>
  ), []);

  // Loading State
  if (loading) {
    return (
      <ScreenContainer centered>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </ScreenContainer>
    );
  }

  // Empty State
  if (artisans.length === 0) {
    return (
      <ScreenContainer centered>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="people-outline"
            size={80}
            color={Colors.textTertiary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No contacts saved</Text>
          <Text style={styles.emptySubtitle}>
            Add your service providers for quick access
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddContact}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={styles.emptyButtonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // List View
  return (
    <ScreenContainer noPadding>
      <FlatList
        data={artisans}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={FABStyles.fab}
        onPress={handleAddContact}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.screenPadding,
  },
  header: {
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.screenPadding,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 24,
    gap: Spacing.sm,
  },
  emptyButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
});


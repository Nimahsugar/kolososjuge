/**
 * Layout & Utility Styles
 * Screen containers, safe areas, and utility helpers
 */

import { TextStyle, ViewStyle } from 'react-native';
import { Colors } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';

// ============================================================================
// LAYOUT STYLES - Safe Area & Screen Containers
// ============================================================================

export const LayoutStyles = {
  // Screen Container
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  } as ViewStyle,
  
  // Safe Area Container
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  } as ViewStyle,
  
  // Content Container (with padding)
  container: {
    flex: 1,
    padding: Spacing.screenPadding,
  } as ViewStyle,
  
  // Scrollable Content
  scrollContent: {
    padding: Spacing.screenPadding,
  } as ViewStyle,
  
  // Centered Content
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  } as ViewStyle,
  
  emptyStateText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  } as TextStyle,
};

// ============================================================================
// UTILITY STYLES
// ============================================================================

export const Utils = {
  // Flex utilities
  flexRow: { flexDirection: 'row' as const },
  flexColumn: { flexDirection: 'column' as const },
  flexCenter: { justifyContent: 'center' as const, alignItems: 'center' as const },
  flexBetween: { justifyContent: 'space-between' as const },
  flexWrap: { flexWrap: 'wrap' as const },
  
  // Text alignment
  textCenter: { textAlign: 'center' as const },
  textLeft: { textAlign: 'left' as const },
  textRight: { textAlign: 'right' as const },
  
  // Width/Height
  fullWidth: { width: '100%' },
  fullHeight: { height: '100%' },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  } as ViewStyle,
  
  dividerVertical: {
    width: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.md,
  } as ViewStyle,
};


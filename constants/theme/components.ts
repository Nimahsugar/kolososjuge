/**
 * Component Styles
 * Pre-defined styles for buttons, inputs, cards, badges, modals, etc.
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';
import { Colors } from './colors';
import { Shadows } from './shadows';
import { BorderRadius, Spacing } from './spacing';
import { Typography } from './typography';

// ============================================================================
// BUTTONS
// ============================================================================

export const ButtonStyles = {
  // Primary Button
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  primaryText: {
    ...Typography.button,
    color: Colors.white,
  } as TextStyle,
  
  // Secondary Button
  secondary: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  secondaryText: {
    ...Typography.button,
    color: Colors.white,
  } as TextStyle,
  
  // Outlined Button
  outlined: {
    backgroundColor: Colors.transparent,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  outlinedText: {
    ...Typography.button,
    color: Colors.primary,
  } as TextStyle,
  
  // Ghost Button
  ghost: {
    backgroundColor: Colors.transparent,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  ghostText: {
    ...Typography.button,
    color: Colors.primary,
  } as TextStyle,
  
  // Danger Button
  danger: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  dangerText: {
    ...Typography.button,
    color: Colors.white,
  } as TextStyle,
  
  // Danger Outlined Button
  dangerOutlined: {
    backgroundColor: Colors.transparent,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    borderWidth: 1.5,
    borderColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  dangerOutlinedText: {
    ...Typography.button,
    color: Colors.error,
  } as TextStyle,
  
  // Disabled Button
  disabled: {
    backgroundColor: Colors.gray300,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  disabledText: {
    ...Typography.button,
    color: Colors.textDisabled,
  } as TextStyle,
  
  // Small Button
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  } as ViewStyle,
  
  smallText: {
    ...Typography.buttonSmall,
  } as TextStyle,
};

// ============================================================================
// INPUT FIELDS
// ============================================================================

export const InputStyles = {
  container: {
    marginBottom: Spacing.md,
  } as ViewStyle,
  
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  } as TextStyle,
  
  required: {
    color: Colors.error,
  } as TextStyle,
  
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.input,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.inputHorizontalPadding,
    ...Typography.body,
    color: Colors.textPrimary,
  } as ViewStyle & TextStyle,
  
  inputFocused: {
    borderColor: Colors.borderFocus,
    borderWidth: 2,
  } as ViewStyle,
  
  inputError: {
    borderColor: Colors.error,
    borderWidth: 1.5,
  } as ViewStyle,
  
  inputDisabled: {
    backgroundColor: Colors.gray100,
    color: Colors.textDisabled,
  } as ViewStyle & TextStyle,
  
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  } as TextStyle,
  
  helperText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  } as TextStyle,
  
  // Text Area
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  } as ViewStyle & TextStyle,
};

// ============================================================================
// CARDS
// ============================================================================

export const CardStyles = {
  // Standard Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    ...Shadows.card,
  } as ViewStyle,
  
  // Flat Card (no shadow)
  cardFlat: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
  } as ViewStyle,
  
  // Metric Card (for dashboard)
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    ...Shadows.card,
    alignItems: 'center',
  } as ViewStyle,
  
  metricValue: {
    ...Typography.amountLarge,
    marginBottom: Spacing.xs,
  } as TextStyle,
  
  metricLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  } as TextStyle,
  
  // List Item Card
  listItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.listItemSpacing,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  } as ViewStyle,
  
  // Section Card
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    marginBottom: Spacing.md,
    ...Shadows.card,
  } as ViewStyle,
  
  sectionTitle: {
    ...Typography.h5,
    marginBottom: Spacing.md,
  } as TextStyle,
  
  // Elevated Card (with stronger shadow)
  elevated: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    ...Shadows.card,
  } as ViewStyle,
};

// ============================================================================
// HEADERS & NAVIGATION
// ============================================================================

export const HeaderStyles = {
  // Screen Header
  header: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
  } as ViewStyle,
  
  headerTitle: {
    ...Typography.h4,
  } as TextStyle,
  
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  } as TextStyle,
  
  // Tab Bar
  tabBar: {
    backgroundColor: Colors.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.select({ ios: Spacing.sm, default: 0 }),
    height: Platform.select({ ios: 84, default: 60 }),
  } as ViewStyle,
  
  tabBarLabel: {
    ...Typography.labelSmall,
  } as TextStyle,
};

// ============================================================================
// FLOATING ACTION BUTTON (FAB)
// ============================================================================

export const FABStyles = {
  fab: {
    position: 'absolute' as const,
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.floatingButton,
  } as ViewStyle,
  
  fabIcon: {
    color: Colors.white,
  } as TextStyle,
};

// ============================================================================
// STATUS BADGES
// ============================================================================

export const BadgeStyles = {
  badge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
  } as ViewStyle,
  
  badgeText: {
    ...Typography.captionMedium,
    color: Colors.white,
  } as TextStyle,
  
  // Status variants
  paid: {
    backgroundColor: Colors.statusPaid,
  } as ViewStyle,
  
  pending: {
    backgroundColor: Colors.statusPending,
  } as ViewStyle,
  
  overdue: {
    backgroundColor: Colors.statusOverdue,
  } as ViewStyle,
};

// ============================================================================
// MODALS
// ============================================================================

export const ModalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  } as ViewStyle,
  
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.modal,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
    ...Shadows.xl,
  } as ViewStyle,
  
  modalTitle: {
    ...Typography.h4,
    marginBottom: Spacing.md,
  } as TextStyle,
  
  modalMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  } as TextStyle,
  
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  } as ViewStyle,
};


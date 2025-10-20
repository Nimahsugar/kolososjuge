/**
 * Spacing & Border Radius System
 * 8px base unit spacing and consistent border radius values
 */

// Spacing System - 8px Base Unit
export const Spacing = {
  xs: 4,      // 0.5x base unit
  sm: 8,      // 1x base unit
  md: 16,     // 2x base unit
  lg: 24,     // 3x base unit
  xl: 32,     // 4x base unit
  xxl: 40,    // 5x base unit
  xxxl: 48,   // 6x base unit
  huge: 64,   // 8x base unit
  
  // Specific use cases
  screenPadding: 16,
  cardPadding: 16,
  sectionSpacing: 24,
  listItemSpacing: 12,
  inputVerticalPadding: 12,
  inputHorizontalPadding: 16,
};

// Border Radius - Rounded Corners (12-16px range)
export const BorderRadius = {
  xs: 4,      // Small elements
  sm: 8,      // Buttons, small cards
  md: 12,     // Standard cards, inputs
  lg: 16,     // Large cards
  xl: 20,     // Extra large elements
  xxl: 24,    // Special cases
  full: 9999, // Circular (pills, avatars)
  
  // Specific components
  button: 12,
  input: 12,
  card: 16,
  modal: 20,
  avatar: 9999,
};


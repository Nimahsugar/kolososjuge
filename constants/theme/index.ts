/**
 * Rent Flow HQ - Theme System
 * Light theme only - Modern Indigo color palette with soft minimal design
 * 
 * Main entry point for all theme exports
 * Import from '@/constants/theme' to access all theme values
 */

// Export all theme modules
export { Colors } from './colors';
export {
    BadgeStyles, ButtonStyles, CardStyles, FABStyles, HeaderStyles, InputStyles, ModalStyles
} from './components';
export { LayoutStyles, Utils } from './layout';
export { Shadows } from './shadows';
export { BorderRadius, Spacing } from './spacing';
export { FontFamily, FontWeight, Typography } from './typography';

// Re-export as a combined Theme object for convenience
import { Colors } from './colors';
import {
    BadgeStyles,
    ButtonStyles,
    CardStyles,
    FABStyles,
    HeaderStyles,
    InputStyles,
    ModalStyles,
} from './components';
import { LayoutStyles, Utils } from './layout';
import { Shadows } from './shadows';
import { BorderRadius, Spacing } from './spacing';
import { FontFamily, FontWeight, Typography } from './typography';

export const Theme = {
  colors: Colors,
  fontFamily: FontFamily,
  fontWeight: FontWeight,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  buttons: ButtonStyles,
  inputs: InputStyles,
  cards: CardStyles,
  headers: HeaderStyles,
  fab: FABStyles,
  badges: BadgeStyles,
  modals: ModalStyles,
  layout: LayoutStyles,
  utils: Utils,
};

export default Theme;


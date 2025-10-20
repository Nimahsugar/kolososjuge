/**
 * Typography System
 * Font families, weights, and text styles
 */

import { Platform, TextStyle } from 'react-native';
import { Colors } from './colors';

// Font Families - Inter (Body) + Manrope (Headings)
export const FontFamily = {
  // Body Text - Inter
  bodyRegular: Platform.select({
    ios: 'Inter_400Regular',
    android: 'Inter_400Regular',
    web: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    default: 'Inter_400Regular',
  }),
  bodyMedium: Platform.select({
    ios: 'Inter_500Medium',
    android: 'Inter_500Medium',
    web: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    default: 'Inter_500Medium',
  }),
  
  // Headings - Manrope
  headingSemiBold: Platform.select({
    ios: 'Manrope_600SemiBold',
    android: 'Manrope_600SemiBold',
    web: 'Manrope, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    default: 'Manrope_600SemiBold',
  }),
  headingBold: Platform.select({
    ios: 'Manrope_700Bold',
    android: 'Manrope_700Bold',
    web: 'Manrope, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    default: 'Manrope_700Bold',
  }),
  
  // Monospace (for numbers, amounts)
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    web: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    default: 'monospace',
  }),
};

// Font Weights
export const FontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

// Text Styles - Complete Typography System
export const Typography = {
  // Headings
  h1: {
    fontFamily: FontFamily.headingBold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  } as TextStyle,
  
  h2: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  } as TextStyle,
  
  h3: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  } as TextStyle,
  
  h4: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  } as TextStyle,
  
  h5: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  } as TextStyle,
  
  h6: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  } as TextStyle,
  
  // Body Text
  body: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.regular,
    color: Colors.textPrimary,
  } as TextStyle,
  
  bodyMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  } as TextStyle,
  
  bodySmall: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeight.regular,
    color: Colors.textPrimary,
  } as TextStyle,
  
  bodySmallMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  } as TextStyle,
  
  // Caption & Small Text
  caption: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  } as TextStyle,
  
  captionMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  } as TextStyle,
  
  // Label Text
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  } as TextStyle,
  
  labelSmall: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  } as TextStyle,
  
  // Button Text
  // Note: Button colors are defined by button variant styles (primary, outlined, etc.)
  // not by the base typography to allow for flexible button theming
  button: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.medium,
  } as TextStyle,
  
  buttonSmall: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeight.medium,
  } as TextStyle,
  
  // Link Text
  link: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
  } as TextStyle,
  
  // Numbers / Amounts
  amount: {
    fontFamily: FontFamily.mono,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  } as TextStyle,
  
  amountLarge: {
    fontFamily: FontFamily.mono,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  } as TextStyle,
};


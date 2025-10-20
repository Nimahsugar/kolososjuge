import { CardStyles } from '@/constants/theme';
import React from 'react';
import { View, ViewStyle } from 'react-native';

type CardVariant = 'default' | 'flat' | 'metric' | 'listItem' | 'section' | 'elevated';

interface ThemedCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
}

/**
 * ThemedCard - Reusable card component with built-in theme styles
 * 
 * @example
 * <ThemedCard variant="default">
 *   <Text>Card content</Text>
 * </ThemedCard>
 * 
 * @example
 * <ThemedCard variant="metric">
 *   <Text style={CardStyles.metricValue}>24</Text>
 *   <Text style={CardStyles.metricLabel}>Tenants</Text>
 * </ThemedCard>
 */
export function ThemedCard({ 
  children, 
  variant = 'default', 
  style 
}: ThemedCardProps) {
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'default':
        return CardStyles.card;
      case 'flat':
        return CardStyles.cardFlat;
      case 'metric':
        return CardStyles.metricCard;
      case 'listItem':
        return CardStyles.listItem;
      case 'section':
        return CardStyles.section;
      case 'elevated':
        return CardStyles.elevated;
      default:
        return CardStyles.card;
    }
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}


import { LayoutStyles } from '@/constants/theme';
import React from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  centered?: boolean;
  noPadding?: boolean;
  style?: ViewStyle;
  /**
   * Edges to apply safe area insets to.
   * Defaults to ['top', 'left', 'right'] which excludes bottom.
   * This is correct for tab screens where the tab bar handles bottom safe area.
   * For full-screen modals or detail screens, you might want to include 'bottom'.
   */
  edges?: Edge[];
}

/**
 * ScreenContainer - Standard screen wrapper with safe area and optional scrolling
 * 
 * IMPORTANT: This component uses SafeAreaView which AUTOMATICALLY applies safe area insets
 * as padding to the specified edges. DO NOT manually add insets.top or insets.bottom to
 * your content - the SafeAreaView already handles this!
 * 
 * @example Basic usage (safe area automatically applied to top, left, right)
 * <ScreenContainer>
 *   <Text>Content is automatically positioned below the status bar</Text>
 * </ScreenContainer>
 * 
 * @example Scrollable content (safe area still applied automatically)
 * <ScreenContainer scrollable>
 *   <Text>Long scrollable content</Text>
 * </ScreenContainer>
 * 
 * @example Centered content (useful for loading states)
 * <ScreenContainer centered>
 *   <ActivityIndicator />
 * </ScreenContainer>
 * 
 * @example Custom edges (include bottom safe area for non-tab screens)
 * <ScreenContainer edges={['top', 'left', 'right', 'bottom']}>
 *   <Text>Full screen with all safe areas</Text>
 * </ScreenContainer>
 */
export function ScreenContainer({
  children,
  scrollable = false,
  centered = false,
  noPadding = false,
  style,
  edges = ['top', 'left', 'right'], // Default: exclude bottom for tab screens
}: ScreenContainerProps) {
  const contentStyle = [
    centered ? LayoutStyles.centered : undefined,
    !noPadding && !scrollable ? LayoutStyles.container : undefined,
    style,
  ];

  if (scrollable) {
    return (
      <SafeAreaView edges={edges} style={LayoutStyles.safeArea}>
        <ScrollView 
          contentContainerStyle={[
            LayoutStyles.scrollContent,
            centered && LayoutStyles.centered,
            noPadding && { padding: 0 },
            style,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} style={LayoutStyles.safeArea}>
      <View style={contentStyle}>
        {children}
      </View>
    </SafeAreaView>
  );
}


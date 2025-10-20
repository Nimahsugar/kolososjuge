import { CardStyles, Colors, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface ChartDataPoint {
  value: number;
  label: string;
}

interface AnalyticsChartCardProps {
  title: string;
  data: ChartDataPoint[];
  color?: string;
  maxValue?: number;
}

/**
 * AnalyticsChartCard - Display component for bar charts
 * Wraps BarChart from react-native-gifted-charts with consistent styling
 * 
 * @example
 * <AnalyticsChartCard
 *   title="Monthly Revenue"
 *   data={monthlyData}
 *   color={Colors.primary}
 * />
 */
export function AnalyticsChartCard({
  title,
  data,
  color = Colors.primary,
  maxValue,
}: AnalyticsChartCardProps) {
  // Calculate max value if not provided
  const calculatedMaxValue = maxValue || 
    Math.ceil(Math.max(...data.map(d => d.value), 1) * 1.2);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.chartContainer}>
        {data.length > 0 ? (
          <BarChart
            data={data}
            barWidth={32}
            spacing={20}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={styles.yAxisLabel}
            xAxisLabelTextStyle={styles.xAxisLabel}
            noOfSections={4}
            maxValue={calculatedMaxValue}
            frontColor={color}
            backgroundColor="transparent"
            isAnimated
            animationDuration={800}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CardStyles.elevated,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  chartContainer: {
    paddingVertical: Spacing.sm,
    minHeight: 200,
    justifyContent: 'center',
  },
  yAxisLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  xAxisLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  noDataText: {
    ...Typography.body,
    color: Colors.textTertiary,
  },
});


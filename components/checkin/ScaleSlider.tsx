import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';

interface ScaleSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  helper?: string;
}

/**
 * Selector de escala numérica (1-10)
 * Implementación simple con botones táctiles
 */
export function ScaleSlider({
  label,
  value,
  onValueChange,
  min = 1,
  max = 10,
  minLabel,
  maxLabel,
  helper,
}: ScaleSliderProps) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="body" color="textPrimary">
          {label}
        </Text>
        <Text variant="h2" color="textPrimary">
          {value}
        </Text>
      </View>

      <View style={styles.scaleContainer}>
        {values.map((val) => (
          <TouchableOpacity
            key={val}
            style={[
              styles.scaleButton,
              value === val && styles.scaleButtonActive,
            ]}
            onPress={() => onValueChange(val)}
            activeOpacity={0.7}
          >
            <Text
              variant="caption"
              style={[
                styles.scaleButtonText,
                value === val && styles.scaleButtonTextActive,
              ]}
            >
              {val}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(minLabel || maxLabel) && (
        <View style={styles.labels}>
          {minLabel && (
            <Text variant="caption" color="textSecondary">
              {minLabel}
            </Text>
          )}
          {maxLabel && (
            <Text variant="caption" color="textSecondary">
              {maxLabel}
            </Text>
          )}
        </View>
      )}

      {helper && (
        <Text variant="caption" color="textSecondary" style={styles.helper}>
          {helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.gap * 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.gap / 2,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: spacing.gap / 2,
  },
  scaleButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  scaleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  scaleButtonTextActive: {
    color: colors.background,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.gap / 2,
  },
  helper: {
    marginTop: spacing.gap / 2,
  },
});

import React from 'react';
import { View, Switch, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/tokens';
import { Text } from './Text';

interface ToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
}

export function Toggle({ label, value, onValueChange, style }: ToggleProps) {
  return (
    <View style={[styles.container, style]}>
      <Text variant="body" color="textPrimary" style={styles.label}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primarySubtle }}
        thumbColor={value ? colors.primary : colors.card}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
  },
});

import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, spacing, radius, typography } from '@/theme/tokens';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, style, ...props }: InputProps) {
  return (
    <View style={containerStyle}>
      {label && (
        <Text variant="body" color="textPrimary" style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined, style]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && (
        <Text variant="caption" color="danger" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  input: {
    height: spacing.buttonHeight,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: 16,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: 4,
  },
});

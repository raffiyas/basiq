import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme/tokens';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'body' | 'caption';
  color?: keyof typeof colors;
}

export function Text({ variant = 'body', color = 'textPrimary', style, ...props }: TextProps) {
  return (
    <RNText
      style={[
        styles.base,
        variant === 'h1' && styles.h1,
        variant === 'h2' && styles.h2,
        variant === 'body' && styles.body,
        variant === 'caption' && styles.caption,
        { color: colors[color] },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  h1: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    lineHeight: typography.h1.lineHeight,
  },
  h2: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    lineHeight: typography.h2.lineHeight,
  },
  body: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
  },
  caption: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    lineHeight: typography.caption.lineHeight,
  },
});

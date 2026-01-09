import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { colors, spacing, radius, shadow } from '@/theme/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        Platform.OS === 'ios' ? shadow.subtle.ios : shadow.subtle.android,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
  },
});

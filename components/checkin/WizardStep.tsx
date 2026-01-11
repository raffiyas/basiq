import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Button, Card } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { WizardStepConfig } from '@/lib/checkin-types';

interface WizardStepProps {
  config: WizardStepConfig;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  isLoading?: boolean;
}

/**
 * Componente base para pasos del wizard de check-in
 * Maneja layout, progreso, navegación y botones
 */
export function WizardStep({
  config,
  children,
  onNext,
  onBack,
  onSkip,
  nextDisabled = false,
  nextLabel = 'Siguiente',
  isLoading = false,
}: WizardStepProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header - Fixed at top */}
        <View style={styles.header}>
          {/* Progress indicator */}
          <Text variant="caption" color="textSecondary" style={styles.progress}>
            Paso {config.step} de {config.total}
          </Text>

          {/* Title */}
          <Text variant="h1" style={styles.title}>
            {config.title}
          </Text>
        </View>

        {/* Content - Scrollable */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {/* Footer - Fixed at bottom */}
        <View style={styles.footer}>
          {/* Actions */}
          <View style={styles.actions}>
            {/* Back button (if applicable) */}
            {config.canGoBack && (
              <Button
                variant="secondary"
                onPress={handleBack}
                style={styles.backButton}
              >
                Volver
              </Button>
            )}

            {/* Skip button (if applicable) */}
            {config.canSkip && onSkip && (
              <Button
                variant="ghost"
                onPress={onSkip}
                style={styles.skipButton}
              >
                {config.skipLabel || 'Omitir'}
              </Button>
            )}

            {/* Next button */}
            <Button
              onPress={onNext}
              disabled={nextDisabled}
              loading={isLoading}
              style={config.canGoBack ? styles.nextButton : styles.nextButtonFull}
            >
              {nextLabel}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingBottom: spacing.gap,
  },
  progress: {
    marginBottom: 8,
  },
  title: {
    marginBottom: spacing.gap * 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: spacing.gap,
  },
  footer: {
    paddingTop: spacing.gap,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.gap,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  nextButtonFull: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: -40,
    right: 0,
  },
});

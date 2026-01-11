import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (__DEV__) {
      console.log('[WizardStep] Next button pressed - touch event received!');
    }
    onNext();
  };

  const handleClose = () => {
    Alert.alert(
      'Cancelar check-in',
      '¿Estás seguro que quieres salir? Perderás el progreso.',
      [
        {
          text: 'Continuar check-in',
          style: 'cancel',
        },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          },
        },
      ]
    );
  };

  // Calculate footer height for content padding
  // Base height (actions + padding) + safe area bottom
  const FOOTER_BASE_HEIGHT = 60; // Approximate button height + internal padding
  const footerTotalHeight = FOOTER_BASE_HEIGHT + insets.bottom + 24;

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        pointerEvents="box-none"
      >
        {/* Header - Fixed at top */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {/* Progress indicator */}
              <Text variant="caption" color="textSecondary" style={styles.progress}>
                Paso {config.step} de {config.total}
              </Text>

              {/* Title */}
              <Text variant="h1" style={styles.title}>
                {config.title}
              </Text>
            </View>

            {/* Close button - Always visible */}
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content - Scrollable */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: footerTotalHeight }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {/* Footer - Absolute positioned at bottom */}
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 12,
            }
          ]}
          pointerEvents="auto"
        >
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
              onPress={handleNext}
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    paddingRight: spacing.gap,
  },
  progress: {
    marginBottom: 8,
  },
  title: {
    marginBottom: spacing.gap * 2,
  },
  closeButton: {
    marginTop: -4,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff', // Ensure footer has background
    zIndex: 50,
    elevation: 50,
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

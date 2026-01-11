/**
 * Check-in Paso 1: Sueño
 * Recolecta horas de sueño + calidad percibida
 */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Card, Input, Text } from '@/components/ui';
import { WizardStep } from '@/components/checkin/WizardStep';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';

export default function CheckinStep1() {
  const { data, updateData, validateStep } = useCheckin();
  const [sleepHours, setSleepHours] = useState(data.sleep_hours?.toString() || '');
  const [sleepQuality, setSleepQuality] = useState(data.sleep_quality?.toString() || '');

  const handleNext = () => {
    // Normalize comma to dot for decimal numbers
    const normalizedHours = sleepHours.replace(',', '.');
    const hours = parseFloat(normalizedHours);
    const quality = parseInt(sleepQuality);

    if (__DEV__) {
      console.log('[Step1] handleNext called', {
        sleepHours_raw: sleepHours,
        sleepHours_normalized: normalizedHours,
        sleepHours_parsed: hours,
        sleepQuality_raw: sleepQuality,
        sleepQuality_parsed: quality,
      });
    }

    updateData({
      sleep_hours: hours,
      sleep_quality: quality,
    });

    router.push('/checkin/step-2');
  };

  // Parse values with proper normalization
  const normalizedHours = sleepHours.replace(',', '.');
  const parsedHours = parseFloat(normalizedHours);
  const parsedQuality = parseInt(sleepQuality);

  const isValid = validateStep(1, {
    sleep_hours: Number.isFinite(parsedHours) ? parsedHours : undefined,
    sleep_quality: Number.isFinite(parsedQuality) ? parsedQuality : undefined,
  });

  if (__DEV__) {
    console.log('[Step1] Validation check', {
      sleepHours_raw: sleepHours,
      sleepHours_parsed: parsedHours,
      sleepHours_isFinite: Number.isFinite(parsedHours),
      sleepQuality_raw: sleepQuality,
      sleepQuality_parsed: parsedQuality,
      sleepQuality_isFinite: Number.isFinite(parsedQuality),
      isValid,
    });
  }

  return (
    <WizardStep
      config={{
        step: 1,
        total: 5,
        title: 'Sueño',
        canGoBack: false,
      }}
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <Card>
        <Text variant="caption" color="textSecondary" style={styles.helper}>
          Sueño insuficiente limita recuperación y rendimiento.
        </Text>

        <Input
          label="¿Cuántas horas dormiste?"
          placeholder="7.5"
          value={sleepHours}
          onChangeText={setSleepHours}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Input
          label="Calidad del sueño (1 = pésimo, 10 = perfecto)"
          placeholder="8"
          value={sleepQuality}
          onChangeText={setSleepQuality}
          keyboardType="number-pad"
          style={styles.input}
        />

        {sleepHours && parseFloat(sleepHours) < 7 && (
          <Text variant="caption" color="textSecondary" style={styles.warning}>
            Menos de 7h: recuperación comprometida. Ajusta intensidad.
          </Text>
        )}
      </Card>
    </WizardStep>
  );
}

const styles = StyleSheet.create({
  helper: {
    marginBottom: spacing.gap * 1.5,
  },
  input: {
    marginBottom: spacing.gap,
  },
  warning: {
    marginTop: spacing.gap / 2,
    fontStyle: 'italic',
  },
});

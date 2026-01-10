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
    const hours = parseFloat(sleepHours);
    const quality = parseInt(sleepQuality);

    updateData({
      sleep_hours: hours,
      sleep_quality: quality,
    });

    router.push('/checkin/step-2');
  };

  const isValid = validateStep(1, {
    ...data,
    sleep_hours: parseFloat(sleepHours) || undefined,
    sleep_quality: parseInt(sleepQuality) || undefined,
  });

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
          El sueño determina tu capacidad de recuperación y rendimiento
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
            Menos de 7h puede afectar tu recuperación
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

/**
 * Check-in Paso 2: Energía & Estrés
 * Evalúa estado psicofísico actual usando sliders
 */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Card, Text } from '@/components/ui';
import { WizardStep } from '@/components/checkin/WizardStep';
import { ScaleSlider } from '@/components/checkin/ScaleSlider';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';

export default function CheckinStep2() {
  const { data, updateData, validateStep } = useCheckin();
  const [energy, setEnergy] = useState(data.energy ?? 5);
  const [stress, setStress] = useState(data.stress ?? 5);

  const handleNext = () => {
    if (__DEV__) {
      console.log('[Step2] handleNext called', {
        energy,
        stress,
      });
    }

    updateData({
      energy,
      stress,
    });

    router.push('/checkin/step-3');
  };

  const isValid = validateStep(2, {
    energy,
    stress,
  });

  if (__DEV__) {
    console.log('[Step2] Validation check', {
      energy,
      stress,
      isValid,
    });
  }

  return (
    <WizardStep
      config={{
        step: 2,
        total: 5,
        title: 'Estado actual',
        canGoBack: true,
      }}
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <Card>
        <Text variant="caption" color="textSecondary" style={styles.helper}>
          Determina la intensidad permitida para hoy.
        </Text>

        <ScaleSlider
          label="Energía"
          value={energy}
          onValueChange={setEnergy}
          min={1}
          max={10}
          minLabel="Agotado"
          maxLabel="Al máximo"
        />

        <ScaleSlider
          label="Estrés"
          value={stress}
          onValueChange={setStress}
          min={1}
          max={10}
          minLabel="Relajado"
          maxLabel="Muy tenso"
          helper={stress >= 7 ? 'Reducir volumen hoy. Estrés alto.' : undefined}
        />
      </Card>
    </WizardStep>
  );
}

const styles = StyleSheet.create({
  helper: {
    marginBottom: spacing.gap * 1.5,
  },
});

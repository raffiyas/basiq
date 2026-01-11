/**
 * Check-in Paso 4: Nutrición - Proteína
 * Único toggle crítico: proteína cumplida
 */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Card, Toggle, Input, Text } from '@/components/ui';
import { WizardStep } from '@/components/checkin/WizardStep';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';

export default function CheckinStep4() {
  const { data, updateData, validateStep } = useCheckin();
  const [proteinHit, setProteinHit] = useState(data.protein_hit ?? false);
  const [proteinGrams, setProteinGrams] = useState(data.protein_grams?.toString() || '');

  const handleNext = () => {
    updateData({
      protein_hit: proteinHit,
      protein_grams: proteinGrams ? parseInt(proteinGrams) : undefined,
    });

    router.push('/checkin/step-5');
  };

  const isValid = validateStep(4, {
    ...data,
    protein_hit: proteinHit,
  });

  return (
    <WizardStep
      config={{
        step: 4,
        total: 5,
        title: 'Nutrición',
        canGoBack: true,
      }}
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <Card>
        <Text variant="caption" color="textSecondary" style={styles.helper}>
          Proteína insuficiente anula cambios en composición corporal.
        </Text>

        <Toggle
          label="Cumplí mi meta de proteína hoy"
          value={proteinHit}
          onValueChange={setProteinHit}
          style={styles.toggle}
        />

        <Input
          label="¿Cuántos gramos aproximadamente? (Opcional)"
          placeholder="150"
          value={proteinGrams}
          onChangeText={setProteinGrams}
          keyboardType="number-pad"
          style={styles.input}
        />

        {!proteinHit && (
          <Text variant="caption" color="textSecondary" style={styles.warning}>
            Cumple mañana. Déficit acumulado no se recupera.
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
  toggle: {
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

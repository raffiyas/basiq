/**
 * Check-in Paso 3: Entrenamiento
 * Toggle principal + progressive disclosure para detalles
 */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Card, Input, Chip, Toggle, Text } from '@/components/ui';
import { WizardStep } from '@/components/checkin/WizardStep';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';
import { TrainingType } from '@/lib/types';

const TRAINING_TYPES: TrainingType[] = ['Fuerza', 'Cardio', 'Mixto', 'Movilidad'];

export default function CheckinStep3() {
  const { data, updateData, validateStep } = useCheckin();
  const [trained, setTrained] = useState(data.trained ?? false);
  const [trainingType, setTrainingType] = useState<TrainingType | undefined>(data.training_type);
  const [minutes, setMinutes] = useState(data.training_minutes?.toString() || '');
  const [rpe, setRpe] = useState(data.rpe?.toString() || '');

  const handleNext = () => {
    updateData({
      trained,
      training_type: trained ? trainingType : undefined,
      training_minutes: trained && minutes ? parseInt(minutes) : undefined,
      rpe: trained && rpe ? parseInt(rpe) : undefined,
    });

    router.push('/checkin/step-4');
  };

  const isValid = validateStep(3, {
    ...data,
    trained,
    training_type: trained ? trainingType : undefined,
  });

  return (
    <WizardStep
      config={{
        step: 3,
        total: 5,
        title: 'Entrenamiento',
        canGoBack: true,
      }}
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <Card>
        <Toggle
          label="Entrené hoy"
          value={trained}
          onValueChange={(val) => {
            setTrained(val);
            if (!val) {
              // Reset training data if toggled off
              setTrainingType(undefined);
              setMinutes('');
              setRpe('');
            }
          }}
          style={styles.toggle}
        />

        {trained && (
          <>
            <Text variant="body" color="textPrimary" style={styles.label}>
              Tipo de entrenamiento
            </Text>
            <View style={styles.chipContainer}>
              {TRAINING_TYPES.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  selected={trainingType === type}
                  onPress={() => setTrainingType(type)}
                  style={styles.chip}
                />
              ))}
            </View>

            <Input
              label="Duración (minutos) - Opcional"
              placeholder="60"
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="number-pad"
              style={styles.input}
            />

            <Input
              label="Esfuerzo percibido (RPE) - Opcional"
              placeholder="7"
              value={rpe}
              onChangeText={setRpe}
              keyboardType="number-pad"
              style={styles.input}
            />

            <Text variant="caption" color="textSecondary">
              1 = recuperación, 5 = moderado, 7 = duro, 10 = máximo
            </Text>
          </>
        )}

        {!trained && (
          <Text variant="caption" color="textSecondary" style={styles.helperNoTraining}>
            Sin problema. Los días de descanso también son entrenamiento.
          </Text>
        )}
      </Card>
    </WizardStep>
  );
}

const styles = StyleSheet.create({
  toggle: {
    marginBottom: spacing.gap * 1.5,
  },
  label: {
    marginBottom: spacing.gap / 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap / 2,
    marginBottom: spacing.gap * 1.5,
  },
  chip: {
    marginRight: spacing.gap / 2,
    marginBottom: spacing.gap / 2,
  },
  input: {
    marginBottom: spacing.gap,
  },
  helperNoTraining: {
    marginTop: spacing.gap,
    fontStyle: 'italic',
  },
});

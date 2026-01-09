import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Input, Chip, Toggle, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';
import { TrainingType } from '@/lib/types';

const TRAINING_TYPES: TrainingType[] = ['Fuerza', 'Cardio', 'Mixto', 'Movilidad'];

export default function CheckinStep3() {
  const { data, updateData } = useCheckin();
  const [trained, setTrained] = useState(data.trained || false);
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

  const handleBack = () => {
    router.back();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="caption" color="textSecondary" style={styles.step}>
          Paso 3 de 5
        </Text>
        <Text variant="h1" style={styles.header}>
          Check-in
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Entrenamiento
          </Text>

          <Toggle
            label="Entrené hoy"
            value={trained}
            onValueChange={setTrained}
            style={styles.toggle}
          />

          {trained && (
            <>
              <Text variant="body" color="textPrimary" style={styles.label}>
                Tipo
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
                label="Minutos"
                placeholder="Ej: 60"
                value={minutes}
                onChangeText={setMinutes}
                keyboardType="number-pad"
                style={styles.input}
              />

              <Input
                label="Esfuerzo (1–10)"
                placeholder="Ej: 7"
                value={rpe}
                onChangeText={setRpe}
                keyboardType="number-pad"
                style={styles.input}
              />

              <Text variant="caption" color="textSecondary">
                7 = duro pero sostenible.
              </Text>
            </>
          )}
        </Card>

        <View style={styles.buttons}>
          <Button variant="secondary" onPress={handleBack} style={styles.button}>
            Volver
          </Button>
          <Button onPress={handleNext} style={styles.button}>
            Siguiente
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  step: {
    marginBottom: 8,
  },
  header: {
    marginBottom: spacing.gap * 2,
  },
  card: {
    marginBottom: spacing.gap,
  },
  cardTitle: {
    marginBottom: spacing.gap,
  },
  toggle: {
    marginBottom: spacing.gap * 2,
  },
  label: {
    marginBottom: spacing.gap / 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap,
    marginBottom: spacing.gap,
  },
  chip: {
    marginRight: spacing.gap / 2,
    marginBottom: spacing.gap / 2,
  },
  input: {
    marginBottom: spacing.gap,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.gap,
  },
  button: {
    flex: 1,
  },
});

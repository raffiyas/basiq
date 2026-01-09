import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Input, Chip, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { TrainingLocation } from '@/lib/types';

const LOCATIONS: TrainingLocation[] = ['Gym', 'Casa', 'Mixto'];

export default function Step2Screen() {
  const { data, updateData } = useOnboarding();
  const [daysPerWeek, setDaysPerWeek] = useState(data.training_days_per_week?.toString() || '');
  const [sessionDuration, setSessionDuration] = useState(data.session_duration_min?.toString() || '');
  const [location, setLocation] = useState<TrainingLocation | undefined>(data.training_location);
  const [injuries, setInjuries] = useState(data.injuries_notes || '');

  const handleNext = () => {
    if (!daysPerWeek || !sessionDuration || !location) {
      Alert.alert('Error', 'Completa este campo.');
      return;
    }

    updateData({
      training_days_per_week: parseInt(daysPerWeek),
      session_duration_min: parseInt(sessionDuration),
      training_location: location,
      injuries_notes: injuries,
    });

    router.push('/onboarding/step-3');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="caption" color="textSecondary" style={styles.step}>
          Paso 2 de 3
        </Text>
        <Text variant="h1" style={styles.header}>
          Entrenamiento
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Disponibilidad
          </Text>

          <Input
            label="Días por semana"
            placeholder="Ej: 3"
            value={daysPerWeek}
            onChangeText={setDaysPerWeek}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Input
            label="Duración por sesión (min)"
            placeholder="Ej: 60"
            value={sessionDuration}
            onChangeText={setSessionDuration}
            keyboardType="number-pad"
            style={styles.input}
          />
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Dónde entrenas
          </Text>

          <View style={styles.chipContainer}>
            {LOCATIONS.map((loc) => (
              <Chip
                key={loc}
                label={loc}
                selected={location === loc}
                onPress={() => setLocation(loc)}
                style={styles.chip}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Restricciones
          </Text>

          <Input
            label="Lesiones o limitaciones (opcional)"
            placeholder="Ej: rodilla derecha, hombro…"
            value={injuries}
            onChangeText={setInjuries}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
          />
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
  input: {
    marginBottom: spacing.gap,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap,
  },
  chip: {
    marginRight: spacing.gap / 2,
    marginBottom: spacing.gap / 2,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.gap,
  },
  button: {
    flex: 1,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Input, Chip, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Goal, ActivityLevel } from '@/lib/types';

const GOALS: Goal[] = ['Bajar grasa', 'Recomposición corporal', 'Ganar fuerza', 'Bienestar'];
const ACTIVITY_LEVELS: ActivityLevel[] = ['Sedentario', 'Entreno ocasional', 'Entreno regular'];

export default function Step1Screen() {
  const { data, updateData } = useOnboarding();
  const [age, setAge] = useState(data.age?.toString() || '');
  const [height, setHeight] = useState(data.height_cm?.toString() || '');
  const [weight, setWeight] = useState(data.weight_kg?.toString() || '');
  const [goal, setGoal] = useState<Goal | undefined>(data.goal);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | undefined>(data.activity_level);

  const handleNext = () => {
    if (!age || !height || !weight || !goal || !activityLevel) {
      Alert.alert('Error', 'Completa este campo.');
      return;
    }

    updateData({
      age: parseInt(age),
      height_cm: parseInt(height),
      weight_kg: parseFloat(weight),
      goal,
      activity_level: activityLevel,
    });

    router.push('/onboarding/step-2');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="caption" color="textSecondary" style={styles.step}>
          Paso 1 de 3
        </Text>
        <Text variant="h1" style={styles.header}>
          Tu perfil
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Datos básicos
          </Text>

          <Input
            label="Edad"
            placeholder="Ej: 32"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Input
            label="Altura (cm)"
            placeholder="Ej: 175"
            value={height}
            onChangeText={setHeight}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Input
            label="Peso (kg)"
            placeholder="Ej: 70.5"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Objetivo
          </Text>

          <View style={styles.chipContainer}>
            {GOALS.map((g) => (
              <Chip
                key={g}
                label={g}
                selected={goal === g}
                onPress={() => setGoal(g)}
                style={styles.chip}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Nivel actual
          </Text>

          <View style={styles.chipContainer}>
            {ACTIVITY_LEVELS.map((level) => (
              <Chip
                key={level}
                label={level}
                selected={activityLevel === level}
                onPress={() => setActivityLevel(level)}
                style={styles.chip}
              />
            ))}
          </View>
        </Card>

        <Button onPress={handleNext}>Siguiente</Button>
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap,
  },
  chip: {
    marginRight: spacing.gap / 2,
    marginBottom: spacing.gap / 2,
  },
});

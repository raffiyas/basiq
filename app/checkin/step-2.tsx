import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Input, Chip, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';

const PAIN_AREAS = ['Espalda', 'Rodilla', 'Hombro', 'Cuello', 'Cadera', 'Tobillo', 'Otro'];

export default function CheckinStep2() {
  const { data, updateData } = useCheckin();
  const [painLevel, setPainLevel] = useState(data.pain_level?.toString() || '');
  const [painArea, setPainArea] = useState(data.pain_area || '');
  const [weight, setWeight] = useState(data.weight_kg?.toString() || '');

  const handleNext = () => {
    if (!painLevel) {
      Alert.alert('Error', 'Completa este campo.');
      return;
    }

    updateData({
      pain_level: parseInt(painLevel),
      pain_area: painArea || undefined,
      weight_kg: weight ? parseFloat(weight) : undefined,
    });

    router.push('/checkin/step-3');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="caption" color="textSecondary" style={styles.step}>
          Paso 2 de 5
        </Text>
        <Text variant="h1" style={styles.header}>
          Check-in
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Molestias
          </Text>

          <Input
            label="Dolor (0–10)"
            placeholder="Ej: 2"
            value={painLevel}
            onChangeText={setPainLevel}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Text variant="body" color="textPrimary" style={styles.label}>
            Zona
          </Text>
          <View style={styles.chipContainer}>
            {PAIN_AREAS.map((area) => (
              <Chip
                key={area}
                label={area}
                selected={painArea === area}
                onPress={() => setPainArea(painArea === area ? '' : area)}
                style={styles.chip}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Peso (opcional)
          </Text>

          <Input
            placeholder="Ej: 103.2"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            style={styles.input}
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
  label: {
    marginBottom: spacing.gap / 2,
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
  buttons: {
    flexDirection: 'row',
    gap: spacing.gap,
  },
  button: {
    flex: 1,
  },
});

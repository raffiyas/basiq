import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Input, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';

export default function CheckinStep1() {
  const { data, updateData } = useCheckin();
  const [sleepHours, setSleepHours] = useState(data.sleep_hours?.toString() || '');
  const [sleepQuality, setSleepQuality] = useState(data.sleep_quality?.toString() || '');
  const [energy, setEnergy] = useState(data.energy?.toString() || '');
  const [stress, setStress] = useState(data.stress?.toString() || '');
  const [mood, setMood] = useState(data.mood?.toString() || '');

  const handleNext = () => {
    if (!sleepHours || !sleepQuality || !energy || !stress || !mood) {
      Alert.alert('Error', 'Completa este campo.');
      return;
    }

    updateData({
      sleep_hours: parseFloat(sleepHours),
      sleep_quality: parseInt(sleepQuality),
      energy: parseInt(energy),
      stress: parseInt(stress),
      mood: parseInt(mood),
    });

    router.push('/checkin/step-2');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="caption" color="textSecondary" style={styles.step}>
          Paso 1 de 5
        </Text>
        <Text variant="h1" style={styles.header}>
          Check-in
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Sueño
          </Text>

          <Input
            label="Horas"
            placeholder="Ej: 7.5"
            value={sleepHours}
            onChangeText={setSleepHours}
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Input
            label="Calidad (1–10)"
            placeholder="Ej: 8"
            value={sleepQuality}
            onChangeText={setSleepQuality}
            keyboardType="number-pad"
            style={styles.input}
          />
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Estado
          </Text>

          <Input
            label="Energía (1–10)"
            placeholder="Ej: 7"
            value={energy}
            onChangeText={setEnergy}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Input
            label="Estrés (1–10)"
            placeholder="Ej: 5"
            value={stress}
            onChangeText={setStress}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Input
            label="Ánimo (1–10)"
            placeholder="Ej: 8"
            value={mood}
            onChangeText={setMood}
            keyboardType="number-pad"
            style={styles.input}
          />
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
});

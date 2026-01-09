import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';

export default function CheckinResult() {
  const { data } = useCheckin();

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleTalkToCoach = () => {
    router.replace('/(tabs)/coach');
  };

  // Generate simple summary
  const summary = `Sueño: ${data.sleep_hours || '—'}h (${data.sleep_quality || '—'}/10)\nEnergía: ${data.energy || '—'}/10 • Estrés: ${data.stress || '—'}/10\n${data.trained ? `Entrené ${data.training_minutes || '—'} min` : 'No entrené'}`;

  // Generate simple recommendation
  const recommendation = data.sleep_hours && data.sleep_hours < 7
    ? 'Prioriza dormir más esta noche.'
    : 'Sigue así. Mantén la consistencia.';

  // Generate useful truth
  const truth = 'Sin datos, no hay progreso. Registrar es el primer paso.';

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="h1" style={styles.header}>
          Listo
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Resumen
          </Text>
          <Text variant="body" color="textPrimary">
            {summary}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Recomendación para mañana
          </Text>
          <Text variant="body" color="textPrimary">
            {recommendation}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Verdad útil
          </Text>
          <Text variant="body" color="textPrimary">
            {truth}
          </Text>
        </Card>

        <Button onPress={handleGoHome} style={styles.button}>
          Ir a Hoy
        </Button>

        <Button variant="secondary" onPress={handleTalkToCoach} style={styles.button}>
          Hablar con el coach
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.gap * 2,
  },
  card: {
    marginBottom: spacing.gap,
  },
  cardTitle: {
    marginBottom: spacing.gap / 2,
  },
  button: {
    marginBottom: spacing.gap,
  },
});

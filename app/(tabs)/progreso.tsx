import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useRecentCheckins } from '@/hooks';

export default function ProgresoScreen() {
  const { checkins } = useRecentCheckins(7);

  const checkinsCount = checkins.length;
  const trainedDays = checkins.filter(c => c.trained).length;
  const proteinHitDays = checkins.filter(c => c.protein_hit).length;

  const avgSleep = checkins.length > 0
    ? (checkins.reduce((sum, c) => sum + (c.sleep_hours || 0), 0) / checkins.length).toFixed(1)
    : '—';

  const handleGenerateWeeklySummary = () => {
    // TODO: Navigate to coach with summary request
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="h1" style={styles.header}>
          Progreso
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Esta semana
          </Text>

          <View style={styles.stat}>
            <Text variant="body" color="textSecondary">
              Check-ins
            </Text>
            <Text variant="h2">{checkinsCount}/7</Text>
          </View>

          <View style={styles.stat}>
            <Text variant="body" color="textSecondary">
              Entrenos
            </Text>
            <Text variant="h2">{trainedDays}</Text>
          </View>

          <View style={styles.stat}>
            <Text variant="body" color="textSecondary">
              Sueño promedio
            </Text>
            <Text variant="h2">{avgSleep}h</Text>
          </View>

          <View style={styles.stat}>
            <Text variant="body" color="textSecondary">
              Proteína cumplida
            </Text>
            <Text variant="h2">{proteinHitDays}/7</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Sueño
          </Text>
          <Text variant="body" color="textSecondary">
            Gráfico de tendencias (próximamente)
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Peso
          </Text>
          <Text variant="body" color="textSecondary">
            Gráfico de evolución (próximamente)
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Nutrición
          </Text>
          <Text variant="body" color="textSecondary">
            Adherencia semanal (próximamente)
          </Text>
        </Card>

        <Button onPress={handleGenerateWeeklySummary} variant="secondary">
          Generar resumen semanal
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
    marginBottom: spacing.gap,
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.gap,
  },
});

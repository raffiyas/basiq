/**
 * Pantalla de resultado del check-in
 * Muestra feedback determinista basado en la normalización
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Button } from '@/components/ui';
import { spacing, colors } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';
import { generateFeedback, formatSleepHours } from '@/lib/checkin-utils';

export default function CheckinResult() {
  const { getNormalized } = useCheckin();
  const normalized = getNormalized();
  const { summary, recommendation } = generateFeedback(normalized);

  const handleGoHome = () => {
    // Smart navigation: go back if possible, otherwise go to check-in tab
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/checkin');
    }
  };

  const handleTalkToCoach = () => {
    router.replace('/(tabs)/coach');
  };

  // Recovery score color
  const getScoreColor = (score: number) => {
    if (score >= 75) return colors.success || '#22c55e';
    if (score >= 50) return colors.primary;
    return colors.error || '#ef4444';
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="h1" style={styles.header}>
          Check-in completo
        </Text>

        {/* Recovery Score */}
        <Card style={styles.card}>
          <Text variant="caption" color="textSecondary">
            Índice de recuperación
          </Text>
          <Text
            variant="h1"
            style={[styles.score, { color: getScoreColor(normalized.recovery_score) }]}
          >
            {normalized.recovery_score}
          </Text>
          <Text variant="caption" color="textSecondary">
            Basado en sueño, energía y estrés
          </Text>
        </Card>

        {/* Summary */}
        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Resumen
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="caption" color="textSecondary">
                Sueño
              </Text>
              <Text variant="body" color="textPrimary">
                {formatSleepHours(normalized.sleep_hours)} (calidad {normalized.sleep_quality}/10)
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text variant="caption" color="textSecondary">
                Estado
              </Text>
              <Text variant="body" color="textPrimary">
                Energía {normalized.energy}/10 • Estrés {normalized.stress}/10
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text variant="caption" color="textSecondary">
                Entrenamiento
              </Text>
              <Text variant="body" color="textPrimary">
                {normalized.trained
                  ? `${normalized.training_type} ${normalized.training_minutes ? `(${normalized.training_minutes} min)` : ''}`
                  : 'Descanso'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text variant="caption" color="textSecondary">
                Proteína
              </Text>
              <Text variant="body" color="textPrimary">
                {normalized.protein_hit ? '✓ Cumplida' : '✗ No cumplida'}
                {normalized.protein_grams ? ` (${normalized.protein_grams}g)` : ''}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text variant="caption" color="textSecondary">
                Foco
              </Text>
              <Text variant="body" color="textPrimary">
                {normalized.daily_focus}
              </Text>
            </View>
          </View>

          {summary && (
            <Text variant="caption" color="textSecondary" style={styles.summaryNote}>
              {summary}
            </Text>
          )}
        </Card>

        {/* Recommendation */}
        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Recomendación
          </Text>
          <Text variant="body" color="textPrimary">
            {recommendation}
          </Text>
        </Card>

        {/* Actions */}
        <Button onPress={handleGoHome} style={styles.button}>
          Continuar
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
    marginBottom: spacing.gap,
  },
  score: {
    fontSize: 56,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: spacing.gap / 2,
  },
  summaryGrid: {
    gap: spacing.gap,
  },
  summaryItem: {
    gap: 4,
  },
  summaryNote: {
    marginTop: spacing.gap,
    fontStyle: 'italic',
  },
  button: {
    marginBottom: spacing.gap,
  },
});

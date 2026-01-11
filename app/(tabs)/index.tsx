import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Screen, Text, Card, Button } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { useProfile, useTodayCheckin, useRecentCheckins } from '@/hooks';
import { computeFlags, getFocusActions, getDefaultCoachTip } from '@/lib/coach';

export default function HomeScreen() {
  const { profile } = useProfile();
  const { checkin } = useTodayCheckin();
  const { checkins } = useRecentCheckins(7);

  const flags = computeFlags(checkins, checkin, profile);
  const focusActions = getFocusActions(flags, !!checkin);

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleCheckin = () => {
    router.push('/checkin');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h1">Hoy</Text>
          <TouchableOpacity onPress={handleSettings}>
            <FontAwesome name="cog" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stat Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text variant="caption" color="textSecondary">
              Sueño
            </Text>
            <Text variant="h2" style={styles.statValue}>
              {checkin?.sleep_hours ? `${checkin.sleep_hours}h` : '—'}
            </Text>
            <Text variant="caption" color="textSecondary">
              Calidad {checkin?.sleep_quality || '—'}/10
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text variant="caption" color="textSecondary">
              Energía
            </Text>
            <Text variant="h2" style={styles.statValue}>
              {checkin?.energy ? `${checkin.energy}/10` : '—'}
            </Text>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text variant="caption" color="textSecondary">
              Estrés
            </Text>
            <Text variant="h2" style={styles.statValue}>
              {checkin?.stress ? `${checkin.stress}/10` : '—'}
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text variant="caption" color="textSecondary">
              Pasos
            </Text>
            <Text variant="h2" style={styles.statValue}>
              —
            </Text>
          </Card>
        </View>

        {/* Focus Card */}
        <Card style={styles.focusCard}>
          <Text variant="h2" style={styles.cardTitle}>
            Tu foco hoy
          </Text>
          {focusActions.map((action, index) => (
            <Text key={index} variant="body" style={styles.focusAction}>
              • {action}
            </Text>
          ))}
        </Card>

        {/* Check-in CTA */}
        {!checkin && (
          <View style={styles.ctaContainer}>
            <Button onPress={handleCheckin} style={styles.button}>
              Hacer check-in (2 min)
            </Button>
            <Text variant="caption" color="textSecondary" style={styles.ctaMicroCopy}>
              Esto ajusta tu plan de hoy automáticamente.
            </Text>
          </View>
        )}

        {/* Coach Card */}
        <Card style={styles.coachCard}>
          <Text variant="h2" style={styles.cardTitle}>
            Coach
          </Text>
          <Text variant="body" color="textSecondary" style={styles.coachTip}>
            {getDefaultCoachTip()}
          </Text>
          <View style={styles.coachActions}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/coach')}>
              <Text variant="body" color="primary">
                Qué hago hoy
              </Text>
            </TouchableOpacity>
            <Text variant="body" color="textSecondary"> • </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/coach')}>
              <Text variant="body" color="primary">
                Ajusta mi plan
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.gap * 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.gap,
    marginBottom: spacing.gap,
  },
  statCard: {
    flex: 1,
  },
  statValue: {
    marginVertical: 4,
  },
  focusCard: {
    marginBottom: spacing.gap,
  },
  cardTitle: {
    marginBottom: spacing.gap,
  },
  focusAction: {
    marginBottom: 4,
  },
  ctaContainer: {
    marginBottom: spacing.gap * 1.5,
    marginTop: spacing.gap * 0.5,
  },
  button: {
    marginBottom: spacing.gap * 0.5,
    height: 56,
  },
  ctaMicroCopy: {
    textAlign: 'center',
    paddingHorizontal: spacing.cardPadding,
  },
  coachCard: {
    marginBottom: spacing.gap,
  },
  coachTip: {
    marginBottom: spacing.gap,
  },
  coachActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

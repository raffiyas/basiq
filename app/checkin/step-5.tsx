import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Input, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';

export default function CheckinStep5() {
  const { data, updateData, saveCheckin } = useCheckin();
  const [note, setNote] = useState(data.note || '');
  const [tomorrowPlan, setTomorrowPlan] = useState(data.tomorrow_plan || '');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    updateData({
      note,
      tomorrow_plan: tomorrowPlan,
    });

    setLoading(true);
    try {
      await saveCheckin();
      router.push('/checkin/result');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="caption" color="textSecondary" style={styles.step}>
          Paso 5 de 5
        </Text>
        <Text variant="h1" style={styles.header}>
          Check-in
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Qué te complicó hoy
          </Text>

          <Input
            placeholder="1–2 líneas."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
          />
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Qué harás mejor mañana (opcional)
          </Text>

          <Input
            placeholder="Ej: acostarme antes, preparar colación…"
            value={tomorrowPlan}
            onChangeText={setTomorrowPlan}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
          />
        </Card>

        <View style={styles.buttons}>
          <Button variant="secondary" onPress={handleBack} style={styles.button}>
            Volver
          </Button>
          <Button onPress={handleFinish} loading={loading} style={styles.button}>
            Guardar
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
    marginBottom: 0,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.gap,
  },
  button: {
    flex: 1,
  },
});

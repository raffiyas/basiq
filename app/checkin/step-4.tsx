import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Toggle, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';

export default function CheckinStep4() {
  const { data, updateData } = useCheckin();
  const [proteinHit, setProteinHit] = useState(data.protein_hit || false);
  const [veggiesHit, setVeggiesHit] = useState(data.veggies_hit || false);
  const [waterHit, setWaterHit] = useState(data.water_hit || false);

  const handleNext = () => {
    updateData({
      protein_hit: proteinHit,
      veggies_hit: veggiesHit,
      water_hit: waterHit,
    });

    router.push('/checkin/step-5');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="caption" color="textSecondary" style={styles.step}>
          Paso 4 de 5
        </Text>
        <Text variant="h1" style={styles.header}>
          Check-in
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Nutrición
          </Text>

          <Toggle
            label="Proteína cumplida"
            value={proteinHit}
            onValueChange={setProteinHit}
            style={styles.toggle}
          />

          <Toggle
            label="Verduras"
            value={veggiesHit}
            onValueChange={setVeggiesHit}
            style={styles.toggle}
          />

          <Toggle
            label="Agua"
            value={waterHit}
            onValueChange={setWaterHit}
            style={styles.toggle}
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
  toggle: {
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

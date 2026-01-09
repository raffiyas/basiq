import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Input, Chip, Toggle, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { NutritionMode } from '@/lib/types';

const NUTRITION_MODES: NutritionMode[] = ['Guía simple', 'Porciones', 'Calorías/macros'];

export default function Step3Screen() {
  const { data, updateData, saveProfile } = useOnboarding();
  const [nutritionMode, setNutritionMode] = useState<NutritionMode | undefined>(data.nutrition_mode);
  const [proteinTarget, setProteinTarget] = useState(data.protein_target_g?.toString() || '');
  const [firstMeal, setFirstMeal] = useState(data.first_meal_time || '');
  const [lastMeal, setLastMeal] = useState(data.last_meal_time || '');
  const [fasting12h, setFasting12h] = useState(data.fasting_12h || false);
  const [loading, setLoading] = useState(false);

  // Calculate suggested protein based on weight
  const suggestedProtein = data.weight_kg ? Math.round(data.weight_kg * 1.6) : 0;

  useEffect(() => {
    if (!proteinTarget && suggestedProtein > 0) {
      setProteinTarget(suggestedProtein.toString());
    }
  }, [suggestedProtein]);

  const handleFinish = async () => {
    if (!nutritionMode || !proteinTarget || !firstMeal || !lastMeal) {
      Alert.alert('Error', 'Completa este campo.');
      return;
    }

    updateData({
      nutrition_mode: nutritionMode,
      protein_target_g: parseInt(proteinTarget),
      first_meal_time: firstMeal,
      last_meal_time: lastMeal,
      fasting_12h: fasting12h,
    });

    setLoading(true);
    try {
      await saveProfile();
      router.replace('/(tabs)');
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
          Paso 3 de 3
        </Text>
        <Text variant="h1" style={styles.header}>
          Nutrición
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Modo
          </Text>

          <View style={styles.chipContainer}>
            {NUTRITION_MODES.map((mode) => (
              <Chip
                key={mode}
                label={mode}
                selected={nutritionMode === mode}
                onPress={() => setNutritionMode(mode)}
                style={styles.chip}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Proteína diaria
          </Text>

          {suggestedProtein > 0 && (
            <Text variant="caption" color="textSecondary" style={styles.suggestion}>
              Sugerencia: {suggestedProtein}g
            </Text>
          )}

          <Input
            label="Objetivo (g/día)"
            placeholder="Ej: 120"
            value={proteinTarget}
            onChangeText={setProteinTarget}
            keyboardType="number-pad"
            style={styles.input}
          />

          <Text variant="caption" color="textSecondary">
            Ajusta si lo necesitas.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Horarios
          </Text>

          <Input
            label="Primera comida"
            placeholder="Ej: 08:00"
            value={firstMeal}
            onChangeText={setFirstMeal}
            style={styles.input}
          />

          <Input
            label="Última comida"
            placeholder="Ej: 20:00"
            value={lastMeal}
            onChangeText={setLastMeal}
            style={styles.input}
          />

          <Toggle
            label="Ayuno mínimo 12h"
            value={fasting12h}
            onValueChange={setFasting12h}
          />
        </Card>

        <View style={styles.buttons}>
          <Button variant="secondary" onPress={handleBack} style={styles.button}>
            Volver
          </Button>
          <Button onPress={handleFinish} loading={loading} style={styles.button}>
            Crear mi plan
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
  suggestion: {
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

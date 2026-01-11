/**
 * Check-in Paso 5: Intención del día
 * Define foco principal + plan de acción opcional
 */
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Card, Input, Chip, Text } from '@/components/ui';
import { WizardStep } from '@/components/checkin/WizardStep';
import { spacing } from '@/theme/tokens';
import { useCheckin } from '@/contexts/CheckinContext';
import { DailyFocus } from '@/lib/checkin-types';

const DAILY_FOCUS_OPTIONS: DailyFocus[] = [
  'Entrenar',
  'Recuperar',
  'Nutrición',
  'Trabajo/Familia',
];

export default function CheckinStep5() {
  const { data, updateData, validateStep, saveCheckin } = useCheckin();
  const [dailyFocus, setDailyFocus] = useState<DailyFocus | undefined>(data.daily_focus);
  const [actionPlan, setActionPlan] = useState(data.action_plan || '');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (__DEV__) {
      console.log('[Step5] handleFinish called', {
        dailyFocus,
        actionPlan,
      });
    }

    updateData({
      daily_focus: dailyFocus,
      action_plan: actionPlan || undefined,
    });

    setLoading(true);
    try {
      await saveCheckin();
      router.replace('/checkin/result');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = validateStep(5, {
    daily_focus: dailyFocus,
  });

  if (__DEV__) {
    console.log('[Step5] Validation check', {
      dailyFocus,
      isValid,
    });
  }

  return (
    <WizardStep
      config={{
        step: 5,
        total: 5,
        title: 'Intención',
        canGoBack: true,
      }}
      onNext={handleFinish}
      nextDisabled={!isValid}
      nextLabel="Finalizar"
      isLoading={loading}
    >
      <Card>
        <Text variant="caption" color="textSecondary" style={styles.helper}>
          Define tu prioridad principal para hoy
        </Text>

        <Text variant="body" color="textPrimary" style={styles.label}>
          ¿En qué vas a enfocarte?
        </Text>
        <View style={styles.chipContainer}>
          {DAILY_FOCUS_OPTIONS.map((focus) => (
            <Chip
              key={focus}
              label={focus}
              selected={dailyFocus === focus}
              onPress={() => setDailyFocus(focus)}
              style={styles.chip}
            />
          ))}
        </View>

        <Input
          label="Plan de acción (opcional)"
          placeholder="Ej: Entrenar pierna a las 7am, preparar carne para toda la semana"
          value={actionPlan}
          onChangeText={setActionPlan}
          multiline
          numberOfLines={2}
          maxLength={100}
          style={styles.input}
        />

        <Text variant="caption" color="textSecondary">
          Máximo 100 caracteres
        </Text>
      </Card>
    </WizardStep>
  );
}

const styles = StyleSheet.create({
  helper: {
    marginBottom: spacing.gap * 1.5,
  },
  label: {
    marginBottom: spacing.gap / 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap / 2,
    marginBottom: spacing.gap * 1.5,
  },
  chip: {
    marginRight: spacing.gap / 2,
    marginBottom: spacing.gap / 2,
  },
  input: {
    marginBottom: spacing.gap / 2,
    height: 70,
    paddingTop: 12,
  },
});

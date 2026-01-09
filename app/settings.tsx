import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Chip, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useProfile } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { CoachTone } from '@/lib/types';

const TONES: CoachTone[] = ['directo', 'estricto'];

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { profile, refresh } = useProfile();
  const [tone, setTone] = useState<CoachTone>(profile?.coach_tone || 'directo');
  const [loading, setLoading] = useState(false);

  const handleSaveTone = async () => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profile')
        .update({ coach_tone: tone })
        .eq('user_id', user.id);

      if (error) throw error;

      await refresh();
      Alert.alert('Guardado', 'Tono del coach actualizado.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="h1" style={styles.header}>
          Ajustes
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Perfil
          </Text>
          <Text variant="body" color="textSecondary">
            Edad: {profile?.age || '—'}
          </Text>
          <Text variant="body" color="textSecondary">
            Peso: {profile?.weight_kg || '—'} kg
          </Text>
          <Text variant="body" color="textSecondary">
            Objetivo: {profile?.goal || '—'}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Objetivo y plan
          </Text>
          <Text variant="body" color="textSecondary">
            Días de entrenamiento: {profile?.training_days_per_week || '—'}
          </Text>
          <Text variant="body" color="textSecondary">
            Proteína diaria: {profile?.protein_target_g || '—'}g
          </Text>
          <Text variant="body" color="textSecondary">
            Modo nutrición: {profile?.nutrition_mode || '—'}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Tono del coach
          </Text>

          <View style={styles.chipContainer}>
            {TONES.map((t) => (
              <Chip
                key={t}
                label={t === 'directo' ? 'Directo' : 'Estricto'}
                selected={tone === t}
                onPress={() => setTone(t)}
                style={styles.chip}
              />
            ))}
          </View>

          <Button
            onPress={handleSaveTone}
            loading={loading}
            variant="secondary"
            style={styles.saveButton}
          >
            Guardar
          </Button>
        </Card>

        <Button onPress={handleLogout} variant="ghost">
          Cerrar sesión
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gap,
    marginBottom: spacing.gap,
  },
  chip: {
    marginRight: spacing.gap / 2,
    marginBottom: spacing.gap / 2,
  },
  saveButton: {
    marginTop: spacing.gap,
  },
});

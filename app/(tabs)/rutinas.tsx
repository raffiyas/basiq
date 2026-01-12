/**
 * Tab de Rutinas
 * Muestra la rutina del día adaptada al recovery score
 * y permite marcarla como completada
 */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text, Card, Button } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { useProfile, useTodayCheckin, useRecentCheckins } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  generateDailyRoutine,
  getDayName,
  isRestDay,
  AdaptedRoutine,
  RoutineExercise,
} from '@/lib/routines';
import { normalizeCheckin } from '@/lib/checkin-utils';

export default function RutinasScreen() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { checkin } = useTodayCheckin();
  const { checkins } = useRecentCheckins(7);

  const [routine, setRoutine] = useState<AdaptedRoutine | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [completing, setCompleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayName = getDayName(dayOfWeek);

  // Calcular recovery score
  const recoveryScore = checkin
    ? normalizeCheckin({
        date: checkin.date,
        sleep_hours: checkin.sleep_hours,
        sleep_quality: checkin.sleep_quality,
        energy: checkin.energy,
        stress: checkin.stress,
      }).recovery_score
    : 50; // Default si no hay check-in

  // Generar rutina cuando cambia el perfil o check-in
  useEffect(() => {
    if (!profile) {
      console.log('[Rutinas] No profile yet');
      setIsGenerating(false);
      return;
    }

    console.log('[Rutinas] Generating routine with:', {
      goal: profile.goal,
      activity_level: profile.activity_level,
      training_days_per_week: profile.training_days_per_week,
      training_location: profile.training_location,
      session_duration_min: profile.session_duration_min,
      recovery_score: recoveryScore,
      day_of_week: dayOfWeek,
    });

    setIsGenerating(true);

    const generatedRoutine = generateDailyRoutine({
      user_profile: {
        goal: profile.goal || 'Bienestar',
        activity_level: profile.activity_level || 'Entreno ocasional',
        training_days_per_week: profile.training_days_per_week || 3,
        training_location: profile.training_location || 'Gym',
        session_duration_min: profile.session_duration_min || 45,
        injuries_notes: profile.injuries_notes,
      },
      recovery_score: recoveryScore,
      day_of_week: dayOfWeek,
      recent_workouts: [],
    });

    console.log('[Rutinas] Generated routine:', generatedRoutine);
    setRoutine(generatedRoutine);
    setIsGenerating(false);
  }, [profile, checkin, dayOfWeek, recoveryScore]);

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(prev => (prev === exerciseId ? null : exerciseId));
  };

  const toggleCompleted = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleCompleteWorkout = async () => {
    if (!user || !routine) return;

    const completedCount = completedExercises.size;
    const totalCount = routine.exercises.length;

    if (completedCount < totalCount * 0.5) {
      Alert.alert(
        'Rutina incompleta',
        `Solo completaste ${completedCount} de ${totalCount} ejercicios. ¿Marcar como completada de todas formas?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sí, completar', onPress: () => saveWorkout() },
        ]
      );
    } else {
      await saveWorkout();
    }
  };

  const saveWorkout = async () => {
    if (!user || !routine) return;

    setCompleting(true);
    try {
      // Actualizar el check-in de hoy con trained = true
      const todayDate = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('daily_checkins')
        .update({
          trained: true,
          training_type: routine.training_type,
          training_minutes: routine.duration_minutes,
        })
        .eq('user_id', user.id)
        .eq('date', todayDate);

      if (error) throw error;

      Alert.alert(
        '¡Rutina completada!',
        'Tu entrenamiento ha sido registrado.',
        [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar el entrenamiento.');
    } finally {
      setCompleting(false);
    }
  };

  // Vista de día de descanso
  if (!routine && profile) {
    const restDay = isRestDay(profile.training_days_per_week || 3, dayOfWeek);

    console.log('[Rutinas] No routine generated, checking if rest day:', {
      restDay,
      training_days_per_week: profile.training_days_per_week,
      dayOfWeek,
      dayName,
    });

    if (restDay) {
      return (
        <Screen>
          <View style={styles.container}>
            <Text variant="h1" style={styles.header}>
              Rutinas
            </Text>

            <Card style={styles.restCard}>
              <Ionicons name="moon" size={48} color={colors.primary} style={styles.restIcon} />
              <Text variant="h2" style={styles.restTitle}>
                Día de descanso
              </Text>
              <Text variant="body" color="textSecondary" style={styles.restText}>
                Hoy es {dayName}. Según tu plan, hoy descansas.
              </Text>
              <Text variant="body" color="textSecondary" style={styles.restText}>
                El descanso es parte del proceso. Aprovecha para dormir bien y cumplir tu meta de proteína.
              </Text>
            </Card>

            <Card style={styles.tipsCard}>
              <Text variant="h2" style={styles.cardTitle}>
                Qué puedes hacer hoy
              </Text>
              <Text variant="body" style={styles.tipItem}>
                • Caminar 20-30 minutos
              </Text>
              <Text variant="body" style={styles.tipItem}>
                • Estiramientos suaves
              </Text>
              <Text variant="body" style={styles.tipItem}>
                • Foam rolling
              </Text>
              <Text variant="body" style={styles.tipItem}>
                • Preparar comidas de la semana
              </Text>
            </Card>
          </View>
        </Screen>
      );
    }
  }

  // Vista sin check-in
  if (!checkin) {
    return (
      <Screen>
        <View style={styles.container}>
          <Text variant="h1" style={styles.header}>
            Rutinas
          </Text>

          <Card style={styles.noCheckinCard}>
            <Ionicons name="alert-circle" size={48} color={colors.warning} style={styles.restIcon} />
            <Text variant="h2" style={styles.restTitle}>
              Haz tu check-in primero
            </Text>
            <Text variant="body" color="textSecondary" style={styles.restText}>
              Necesito saber cómo dormiste y tu nivel de energía para adaptar la rutina de hoy.
            </Text>

            <Button onPress={() => router.push('/checkin')} style={styles.checkinButton}>
              Hacer check-in
            </Button>
          </Card>
        </View>
      </Screen>
    );
  }

  // Vista de rutina
  if (!routine) {
    console.log('[Rutinas] Showing loading state - routine is null but not rest day');
    console.log('[Rutinas] Debug info:', {
      hasProfile: !!profile,
      hasCheckin: !!checkin,
      recoveryScore,
      dayOfWeek,
      dayName,
      isGenerating,
    });

    // Si ya terminó de generar pero la rutina es null y no es día de descanso,
    // es un posible bug en generateDailyRoutine
    if (!isGenerating && profile) {
      const restDay = isRestDay(profile.training_days_per_week || 3, dayOfWeek);
      console.log('[Rutinas] ERROR: Routine is null after generation completed, restDay:', restDay);

      return (
        <Screen>
          <View style={styles.container}>
            <Text variant="h1" style={styles.header}>
              Rutinas
            </Text>
            <Card style={styles.noCheckinCard}>
              <Ionicons name="alert-circle" size={48} color={colors.warning} style={styles.restIcon} />
              <Text variant="h2" style={styles.restTitle}>
                Error generando rutina
              </Text>
              <Text variant="body" color="textSecondary" style={styles.restText}>
                No se pudo generar la rutina para hoy. Por favor verifica tu perfil o contacta soporte.
              </Text>
              {__DEV__ && (
                <Text variant="caption" color="textSecondary" style={styles.restText}>
                  Debug: RestDay: {restDay ? 'Sí' : 'No'}, Day: {dayOfWeek} ({dayName}), TrainingDays: {profile.training_days_per_week || 3}
                </Text>
              )}
            </Card>
          </View>
        </Screen>
      );
    }

    return (
      <Screen>
        <View style={styles.container}>
          <Text variant="h1" style={styles.header}>
            Rutinas
          </Text>
          <Card>
            <Text variant="body" color="textSecondary">
              Cargando rutina...
            </Text>
            {__DEV__ && (
              <Text variant="caption" color="textSecondary" style={{ marginTop: 8 }}>
                Debug: Profile: {profile ? '✓' : '✗'}, Checkin: {checkin ? '✓' : '✗'}, Recovery: {recoveryScore}, Day: {dayOfWeek}, Generating: {isGenerating ? 'Sí' : 'No'}
              </Text>
            )}
          </Card>
        </View>
      </Screen>
    );
  }

  const completionPercentage = Math.round(
    (completedExercises.size / routine.exercises.length) * 100
  );

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <Text variant="h1" style={styles.header}>
          {dayName}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Adaptation Banner */}
          <Card
            style={[
              styles.adaptationCard,
              routine.adaptation_level === 'recovery' && styles.adaptationRecovery,
              routine.adaptation_level === 'light' && styles.adaptationLight,
            ]}
          >
            <View style={styles.adaptationHeader}>
              <Text variant="h2">{routine.name}</Text>
              <View style={styles.recoveryBadge}>
                <Text variant="caption" style={styles.recoveryText}>
                  {recoveryScore}/100
                </Text>
              </View>
            </View>
            <Text variant="body" color="textSecondary">
              {routine.adaptation_reason}
            </Text>
            <Text variant="caption" color="textSecondary" style={styles.duration}>
              ⏱ {routine.duration_minutes} min · {routine.exercises.length} ejercicios
            </Text>
          </Card>

          {/* Warmup */}
          {routine.warmup_notes && (
            <Card style={styles.warmupCard}>
              <Text variant="body" color="textSecondary">
                🔥 {routine.warmup_notes}
              </Text>
            </Card>
          )}

          {/* Exercises */}
          {routine.exercises.map((ex, index) => (
            <ExerciseCard
              key={ex.exercise_id}
              exercise={ex}
              index={index + 1}
              expanded={expandedExercise === ex.exercise_id}
              completed={completedExercises.has(ex.exercise_id)}
              onToggleExpand={() => toggleExercise(ex.exercise_id)}
              onToggleComplete={() => toggleCompleted(ex.exercise_id)}
            />
          ))}

          {/* Cooldown */}
          {routine.cooldown_notes && (
            <Card style={styles.warmupCard}>
              <Text variant="body" color="textSecondary">
                🧘 {routine.cooldown_notes}
              </Text>
            </Card>
          )}

          {/* Spacer for button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Complete Button */}
        <View style={styles.completeContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
          </View>
          <Button
            onPress={handleCompleteWorkout}
            loading={completing}
            style={styles.completeButton}
          >
            {completionPercentage === 100
              ? '✓ Completar rutina'
              : `Completar (${completionPercentage}%)`}
          </Button>
        </View>
      </View>
    </Screen>
  );
}

// Componente de tarjeta de ejercicio
interface ExerciseCardProps {
  exercise: RoutineExercise;
  index: number;
  expanded: boolean;
  completed: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
}

function ExerciseCard({
  exercise,
  index,
  expanded,
  completed,
  onToggleExpand,
  onToggleComplete,
}: ExerciseCardProps) {
  const ex = exercise.exercise;

  return (
    <Card style={[styles.exerciseCard, completed && styles.exerciseCompleted]}>
      <TouchableOpacity onPress={onToggleExpand} activeOpacity={0.7}>
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseIndex}>
            <Text variant="caption" style={styles.indexText}>
              {index}
            </Text>
          </View>
          <View style={styles.exerciseInfo}>
            <Text variant="body" style={[styles.exerciseName, completed && styles.textCompleted]}>
              {ex.name}
            </Text>
            <Text variant="caption" color="textSecondary">
              {exercise.sets} series × {exercise.reps}
              {exercise.weight_suggestion && ` · ${exercise.weight_suggestion}`}
            </Text>
          </View>
          <TouchableOpacity onPress={onToggleComplete} style={styles.checkButton}>
            <Ionicons
              name={completed ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={completed ? colors.success : colors.border}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.exerciseDetails}>
          <Text variant="body" color="textSecondary" style={styles.description}>
            {ex.description}
          </Text>

          <Text variant="caption" color="textPrimary" style={styles.instructionsTitle}>
            Instrucciones:
          </Text>
          {ex.instructions.map((inst, i) => (
            <Text key={i} variant="caption" color="textSecondary" style={styles.instruction}>
              {i + 1}. {inst}
            </Text>
          ))}

          {ex.tips && ex.tips.length > 0 && (
            <>
              <Text variant="caption" color="textPrimary" style={styles.instructionsTitle}>
                Tips:
              </Text>
              {ex.tips.map((tip, i) => (
                <Text key={i} variant="caption" color="textSecondary" style={styles.instruction}>
                  💡 {tip}
                </Text>
              ))}
            </>
          )}

          {exercise.notes && (
            <View style={styles.notesBadge}>
              <Text variant="caption" color="primary">
                ⚠️ {exercise.notes}
              </Text>
            </View>
          )}

          <Text variant="caption" color="textSecondary" style={styles.restInfo}>
            Descanso: {exercise.rest_seconds} segundos entre series
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.gap,
  },
  scrollView: {
    flex: 1,
  },
  adaptationCard: {
    marginBottom: spacing.gap,
  },
  adaptationRecovery: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  adaptationLight: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  adaptationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recoveryBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recoveryText: {
    color: colors.primary,
    fontWeight: '600',
  },
  duration: {
    marginTop: 8,
  },
  warmupCard: {
    marginBottom: spacing.gap,
    backgroundColor: colors.bg,
  },
  exerciseCard: {
    marginBottom: spacing.gap,
  },
  exerciseCompleted: {
    opacity: 0.7,
    backgroundColor: colors.bg,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    color: colors.card,
    fontWeight: '600',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  checkButton: {
    padding: 4,
  },
  exerciseDetails: {
    marginTop: spacing.gap,
    paddingTop: spacing.gap,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  description: {
    marginBottom: spacing.gap,
  },
  instructionsTitle: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  instruction: {
    marginBottom: 4,
    paddingLeft: 8,
  },
  notesBadge: {
    backgroundColor: colors.primarySubtle,
    padding: 8,
    borderRadius: 8,
    marginTop: spacing.gap,
  },
  restInfo: {
    marginTop: spacing.gap,
    fontStyle: 'italic',
  },
  completeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    padding: spacing.screenPadding,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  completeButton: {
    height: 52,
  },
  // Rest day styles
  restCard: {
    alignItems: 'center',
    paddingVertical: spacing.gap * 2,
    marginBottom: spacing.gap,
  },
  restIcon: {
    marginBottom: spacing.gap,
  },
  restTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  restText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  tipsCard: {
    marginBottom: spacing.gap,
  },
  cardTitle: {
    marginBottom: spacing.gap,
  },
  tipItem: {
    marginBottom: 8,
  },
  // No checkin styles
  noCheckinCard: {
    alignItems: 'center',
    paddingVertical: spacing.gap * 2,
  },
  checkinButton: {
    marginTop: spacing.gap,
    width: '100%',
  },
});

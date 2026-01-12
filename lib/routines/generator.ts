/**
 * Generador de rutinas diarias
 * Crea rutinas personalizadas basadas en:
 * - Perfil del usuario (objetivo, nivel, ubicación)
 * - Recovery score del día
 * - Día de la semana
 * - Entrenamientos recientes
 */

import {
  Routine,
  RoutineExercise,
  AdaptedRoutine,
  RoutineGeneratorConfig,
  MuscleGroup,
  DifficultyLevel,
} from './types';
import { EXERCISES, getExerciseById, filterExercises } from './library';
import { TrainingLocation } from '../types';

/**
 * Plantillas de división semanal según días de entrenamiento
 */
const WEEKLY_SPLITS: Record<number, { day: number; focus: MuscleGroup[]; name: string }[]> = {
  2: [
    { day: 1, focus: ['full_body'], name: 'Full Body A' },
    { day: 4, focus: ['full_body'], name: 'Full Body B' },
  ],
  3: [
    { day: 1, focus: ['pecho', 'triceps', 'hombros'], name: 'Empuje' },
    { day: 3, focus: ['espalda', 'biceps'], name: 'Tracción' },
    { day: 5, focus: ['cuadriceps', 'isquiotibiales', 'gluteos'], name: 'Pierna' },
  ],
  4: [
    { day: 1, focus: ['pecho', 'triceps'], name: 'Pecho y Tríceps' },
    { day: 2, focus: ['espalda', 'biceps'], name: 'Espalda y Bíceps' },
    { day: 4, focus: ['cuadriceps', 'gluteos'], name: 'Pierna A' },
    { day: 5, focus: ['hombros', 'isquiotibiales'], name: 'Hombros y Pierna B' },
  ],
  5: [
    { day: 1, focus: ['pecho'], name: 'Pecho' },
    { day: 2, focus: ['espalda'], name: 'Espalda' },
    { day: 3, focus: ['hombros', 'triceps', 'biceps'], name: 'Hombros y Brazos' },
    { day: 4, focus: ['cuadriceps', 'gluteos'], name: 'Pierna A' },
    { day: 5, focus: ['isquiotibiales', 'gluteos'], name: 'Pierna B' },
  ],
  6: [
    { day: 1, focus: ['pecho', 'triceps'], name: 'Empuje A' },
    { day: 2, focus: ['espalda', 'biceps'], name: 'Tracción A' },
    { day: 3, focus: ['cuadriceps', 'gluteos'], name: 'Pierna A' },
    { day: 4, focus: ['pecho', 'hombros'], name: 'Empuje B' },
    { day: 5, focus: ['espalda', 'biceps'], name: 'Tracción B' },
    { day: 6, focus: ['isquiotibiales', 'gluteos'], name: 'Pierna B' },
  ],
};

/**
 * Determina el nivel de dificultad basado en activity_level
 */
function getDifficultyFromActivityLevel(activityLevel: string): DifficultyLevel {
  switch (activityLevel) {
    case 'Sedentario':
      return 'principiante';
    case 'Entreno ocasional':
      return 'intermedio';
    case 'Entreno regular':
      return 'avanzado';
    default:
      return 'principiante';
  }
}

/**
 * Determina el nivel de adaptación basado en recovery score
 */
function getAdaptationLevel(recoveryScore: number): AdaptedRoutine['adaptation_level'] {
  if (recoveryScore >= 75) return 'full';
  if (recoveryScore >= 50) return 'moderate';
  if (recoveryScore >= 25) return 'light';
  return 'recovery';
}

/**
 * Obtiene la razón de adaptación para mostrar al usuario
 */
function getAdaptationReason(level: AdaptedRoutine['adaptation_level'], recoveryScore: number): string {
  switch (level) {
    case 'full':
      return `Recuperación óptima (${recoveryScore}/100). Rutina completa.`;
    case 'moderate':
      return `Recuperación aceptable (${recoveryScore}/100). Rutina estándar.`;
    case 'light':
      return `Recuperación baja (${recoveryScore}/100). Rutina reducida.`;
    case 'recovery':
      return `Recuperación crítica (${recoveryScore}/100). Solo movilidad y recuperación activa.`;
  }
}

/**
 * Ajusta sets y reps según el nivel de adaptación
 */
function adaptExercise(
  exercise: RoutineExercise,
  adaptationLevel: AdaptedRoutine['adaptation_level']
): RoutineExercise {
  const adapted = { ...exercise };

  switch (adaptationLevel) {
    case 'full':
      // Sin cambios o +1 set si el usuario está muy bien
      adapted.notes = 'Puedes subir peso si te sientes fuerte.';
      break;

    case 'moderate':
      // Sin cambios significativos
      break;

    case 'light':
      // Reducir sets y peso
      adapted.sets = Math.max(2, adapted.sets - 1);
      adapted.weight_suggestion = 'Ligero';
      adapted.notes = 'Reduce el peso 20-30%. Enfócate en técnica.';
      break;

    case 'recovery':
      // Convertir todo a movilidad/muy ligero
      adapted.sets = 2;
      adapted.reps = '10-12';
      adapted.weight_suggestion = 'Muy ligero o sin peso';
      adapted.notes = 'Solo activación. No busques fatiga.';
      break;
  }

  return adapted;
}

/**
 * Crea una rutina de movilidad/recuperación
 */
function createRecoveryRoutine(): Routine {
  const mobilityExercises = filterExercises({ training_type: 'Movilidad' });

  const exercises: RoutineExercise[] = mobilityExercises.slice(0, 6).map(ex => ({
    exercise_id: ex.id,
    exercise: ex,
    sets: 2,
    reps: '30 seg',
    rest_seconds: 30,
    notes: 'Respira profundo, sin prisa.',
  }));

  return {
    id: 'recovery-routine',
    name: 'Recuperación activa',
    description: 'Rutina de movilidad y recuperación. Tu cuerpo necesita descanso.',
    training_type: 'Movilidad',
    muscle_groups: ['full_body'],
    difficulty: 'principiante',
    duration_minutes: 20,
    exercises,
    warmup_notes: 'Camina 2-3 minutos para activar.',
    cooldown_notes: 'Termina con respiración profunda.',
  };
}

/**
 * Genera la rutina del día basada en configuración
 */
export function generateDailyRoutine(config: RoutineGeneratorConfig): AdaptedRoutine | null {
  const {
    user_profile,
    recovery_score,
    day_of_week,
  } = config;

  const adaptationLevel = getAdaptationLevel(recovery_score);

  // Si el recovery es crítico, devolver rutina de recuperación
  if (adaptationLevel === 'recovery') {
    const recoveryRoutine = createRecoveryRoutine();
    return {
      ...recoveryRoutine,
      original_routine_id: 'recovery-routine',
      adaptation_level: 'recovery',
      adaptation_reason: getAdaptationReason('recovery', recovery_score),
      recovery_score,
    };
  }

  // Obtener el split semanal según los días de entrenamiento
  const daysPerWeek = Math.min(6, Math.max(2, user_profile.training_days_per_week));
  const weeklySplit = WEEKLY_SPLITS[daysPerWeek] || WEEKLY_SPLITS[3];

  // Encontrar si hoy es día de entrenamiento
  // day_of_week: 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  // Convertimos a 1-7 para el split (1 = Lunes)
  const dayNumber = day_of_week === 0 ? 7 : day_of_week;

  const todaysPlan = weeklySplit.find(d => d.day === dayNumber);

  if (!todaysPlan) {
    // Hoy es día de descanso según el plan
    return null;
  }

  // Obtener dificultad y ubicación
  const difficulty = getDifficultyFromActivityLevel(user_profile.activity_level);
  const location = user_profile.training_location;

  // Filtrar ejercicios disponibles para hoy
  const availableExercises = filterExercises({
    muscle_groups: todaysPlan.focus,
    difficulty,
    location,
  });

  // Si no hay suficientes ejercicios, incluir ejercicios de cualquier dificultad
  let exercisesToUse = availableExercises;
  if (exercisesToUse.length < 4) {
    exercisesToUse = filterExercises({
      muscle_groups: todaysPlan.focus,
      location,
    });
  }

  // Seleccionar ejercicios para la rutina (4-6 ejercicios según duración)
  const targetExercises = user_profile.session_duration_min >= 60 ? 6 : 4;
  const selectedExercises = exercisesToUse.slice(0, targetExercises);

  // Siempre agregar ejercicio de core
  const coreExercise = EXERCISES.find(
    e => e.muscle_groups.includes('core') && e.location.includes(location)
  );
  if (coreExercise && !selectedExercises.find(e => e.id === coreExercise.id)) {
    selectedExercises.push(coreExercise);
  }

  // Crear ejercicios con sets/reps
  const routineExercises: RoutineExercise[] = selectedExercises.map((ex, index) => {
    let sets = 3;
    let reps = '10-12';
    let rest = 60;

    // Ajustar según tipo de ejercicio
    if (ex.training_type === 'Cardio') {
      reps = '30 seg';
      rest = 30;
    } else if (ex.muscle_groups.includes('core')) {
      reps = ex.id === 'plank' ? '30-45 seg' : '12-15';
      sets = 3;
    } else if (difficulty === 'avanzado') {
      sets = 4;
      reps = '8-10';
      rest = 90;
    } else if (difficulty === 'principiante') {
      sets = 2;
      reps = '12-15';
      rest = 90;
    }

    return {
      exercise_id: ex.id,
      exercise: ex,
      sets,
      reps,
      rest_seconds: rest,
      weight_suggestion: difficulty === 'avanzado' ? 'Moderado-Pesado' : 'Moderado',
    };
  });

  // Adaptar ejercicios según recovery score
  const adaptedExercises = routineExercises.map(ex =>
    adaptExercise(ex, adaptationLevel)
  );

  // Crear la rutina
  const routine: Routine = {
    id: `routine-${dayNumber}-${Date.now()}`,
    name: todaysPlan.name,
    description: `Rutina de ${todaysPlan.name.toLowerCase()} adaptada a tu nivel y recuperación.`,
    training_type: 'Fuerza',
    muscle_groups: todaysPlan.focus,
    difficulty,
    duration_minutes: user_profile.session_duration_min,
    exercises: adaptedExercises,
    warmup_notes: '5 minutos de movilidad articular y activación.',
    cooldown_notes: '3-5 minutos de estiramientos suaves.',
  };

  return {
    ...routine,
    original_routine_id: routine.id,
    adaptation_level: adaptationLevel,
    adaptation_reason: getAdaptationReason(adaptationLevel, recovery_score),
    recovery_score,
  };
}

/**
 * Obtiene el nombre del día de la semana
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayOfWeek] || 'Hoy';
}

/**
 * Determina si hoy es día de descanso según el plan
 */
export function isRestDay(daysPerWeek: number, dayOfWeek: number): boolean {
  const weeklySplit = WEEKLY_SPLITS[Math.min(6, Math.max(2, daysPerWeek))] || WEEKLY_SPLITS[3];
  const dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek;
  return !weeklySplit.some(d => d.day === dayNumber);
}

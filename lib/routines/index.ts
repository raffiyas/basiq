/**
 * Módulo de rutinas de entrenamiento
 * BASIQ - Fitness & Wellness App
 */

// Tipos
export type {
  MuscleGroup,
  DifficultyLevel,
  Equipment,
  Exercise,
  RoutineExercise,
  Routine,
  AdaptedRoutine,
  WeeklyPlan,
  WorkoutLog,
  RoutineGeneratorConfig,
} from './types';

// Biblioteca de ejercicios
export {
  EXERCISES,
  getExerciseById,
  filterExercises,
} from './library';

// Generador de rutinas
export {
  generateDailyRoutine,
  getDayName,
  isRestDay,
} from './generator';

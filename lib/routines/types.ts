/**
 * Tipos para el sistema de rutinas de entrenamiento
 * BASIQ - Fitness & Wellness App
 */

import { TrainingType, TrainingLocation } from '../types';

/**
 * Grupo muscular principal
 */
export type MuscleGroup =
  | 'pecho'
  | 'espalda'
  | 'hombros'
  | 'biceps'
  | 'triceps'
  | 'core'
  | 'cuadriceps'
  | 'isquiotibiales'
  | 'gluteos'
  | 'pantorrillas'
  | 'full_body'
  | 'cardio';

/**
 * Nivel de dificultad
 */
export type DifficultyLevel = 'principiante' | 'intermedio' | 'avanzado';

/**
 * Equipamiento necesario
 */
export type Equipment =
  | 'ninguno'
  | 'mancuernas'
  | 'barra'
  | 'kettlebell'
  | 'banda_elastica'
  | 'maquina'
  | 'banca'
  | 'polea'
  | 'cardio_machine';

/**
 * Ejercicio individual
 */
export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  muscle_groups: MuscleGroup[];
  equipment: Equipment[];
  difficulty: DifficultyLevel;
  training_type: TrainingType;
  location: TrainingLocation[];
  video_url?: string;
  image_url?: string;
  tips?: string[];
}

/**
 * Ejercicio dentro de una rutina con sets/reps específicos
 */
export interface RoutineExercise {
  exercise_id: string;
  exercise: Exercise;
  sets: number;
  reps: string; // "8-12" o "30 seg" para tiempo
  rest_seconds: number;
  notes?: string;
  weight_suggestion?: string; // "Moderado", "Pesado", "Ligero"
}

/**
 * Rutina completa para un día
 */
export interface Routine {
  id: string;
  name: string;
  description: string;
  training_type: TrainingType;
  muscle_groups: MuscleGroup[];
  difficulty: DifficultyLevel;
  duration_minutes: number;
  exercises: RoutineExercise[];
  warmup_notes?: string;
  cooldown_notes?: string;
}

/**
 * Rutina adaptada según recovery score
 */
export interface AdaptedRoutine extends Routine {
  original_routine_id: string;
  adaptation_level: 'full' | 'moderate' | 'light' | 'recovery';
  adaptation_reason: string;
  recovery_score: number;
}

/**
 * Plantilla de plan semanal
 */
export interface WeeklyPlan {
  id: string;
  name: string;
  description: string;
  days_per_week: number;
  difficulty: DifficultyLevel;
  goal: string;
  schedule: {
    day: number; // 1-7 (Lunes-Domingo)
    routine_id: string | null; // null = descanso
    focus: string; // "Tren superior", "Pierna", "Full body", "Descanso"
  }[];
}

/**
 * Log de entrenamiento completado
 */
export interface WorkoutLog {
  id?: string;
  user_id: string;
  date: string;
  routine_id: string;
  routine_name: string;
  adapted: boolean;
  adaptation_level?: AdaptedRoutine['adaptation_level'];
  recovery_score_at_start: number;
  completed: boolean;
  duration_minutes?: number;
  rpe?: number; // 1-10
  notes?: string;
  exercises_completed: {
    exercise_id: string;
    sets_completed: number;
    reps_per_set?: number[];
    weight_per_set?: number[];
    skipped: boolean;
  }[];
  created_at?: string;
}

/**
 * Configuración para generar rutina del día
 */
export interface RoutineGeneratorConfig {
  user_profile: {
    goal: string;
    activity_level: string;
    training_days_per_week: number;
    training_location: TrainingLocation;
    session_duration_min: number;
    injuries_notes?: string;
  };
  recovery_score: number;
  day_of_week: number; // 0-6 (Domingo-Sábado)
  recent_workouts: WorkoutLog[];
}

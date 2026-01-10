/**
 * Tipos específicos para el wizard de check-in diario
 * Separados de types.ts para mantener cohesión
 */

import { TrainingType } from './types';

export type DailyFocus = 'Entrenar' | 'Recuperar' | 'Nutrición' | 'Trabajo/Familia';

/**
 * Datos recolectados en el wizard (formato crudo)
 */
export interface DailyCheckinData {
  date: string;

  // Paso 1: Sueño
  sleep_hours?: number;
  sleep_quality?: number;

  // Paso 2: Energía/Estrés
  energy?: number;
  stress?: number;

  // Paso 3: Entrenamiento
  trained?: boolean;
  training_type?: TrainingType;
  training_minutes?: number;
  rpe?: number;

  // Paso 4: Nutrición
  protein_hit?: boolean;
  protein_grams?: number;

  // Paso 5: Intención
  daily_focus?: DailyFocus;
  action_plan?: string;
}

/**
 * Datos normalizados con flags y scores calculados
 */
export interface NormalizedCheckin extends Required<Omit<DailyCheckinData,
  'training_type' | 'training_minutes' | 'rpe' | 'protein_grams' | 'action_plan'>> {
  // Campos opcionales originales
  training_type?: TrainingType;
  training_minutes?: number;
  rpe?: number;
  protein_grams?: number;
  action_plan?: string;

  // Flags calculados
  sleep_deficit: boolean;      // < 7h
  high_stress: boolean;        // >= 7
  low_energy: boolean;         // <= 4
  hard_training: boolean;      // rpe >= 8

  // Scores
  recovery_score: number;      // 0-100

  // Recomendación
  suggested_action: 'rest' | 'light' | 'normal' | 'push';
}

/**
 * Configuración de cada paso del wizard
 */
export interface WizardStepConfig {
  step: number;
  total: number;
  title: string;
  canGoBack: boolean;
  canSkip?: boolean;
  skipLabel?: string;
}

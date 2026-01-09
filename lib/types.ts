export type Goal = 'Bajar grasa' | 'Recomposición corporal' | 'Ganar fuerza' | 'Bienestar';
export type ActivityLevel = 'Sedentario' | 'Entreno ocasional' | 'Entreno regular';
export type TrainingLocation = 'Gym' | 'Casa' | 'Mixto';
export type NutritionMode = 'Guía simple' | 'Porciones' | 'Calorías/macros';
export type TrainingType = 'Fuerza' | 'Cardio' | 'Mixto' | 'Movilidad';
export type CoachTone = 'directo' | 'estricto';
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Profile {
  user_id: string;
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  goal?: Goal;
  activity_level?: ActivityLevel;
  training_days_per_week?: number;
  session_duration_min?: number;
  training_location?: TrainingLocation;
  injuries_notes?: string;
  nutrition_mode?: NutritionMode;
  protein_target_g?: number;
  first_meal_time?: string;
  last_meal_time?: string;
  fasting_12h?: boolean;
  coach_tone: CoachTone;
  created_at?: string;
  updated_at?: string;
}

export interface DailyCheckin {
  id?: string;
  user_id: string;
  date: string;
  sleep_hours?: number;
  sleep_quality?: number;
  energy?: number;
  stress?: number;
  mood?: number;
  pain_level?: number;
  pain_area?: string;
  weight_kg?: number;
  trained?: boolean;
  training_type?: TrainingType;
  training_minutes?: number;
  rpe?: number;
  protein_hit?: boolean;
  veggies_hit?: boolean;
  water_hit?: boolean;
  note?: string;
  tomorrow_plan?: string;
  created_at?: string;
}

export interface CoachMessage {
  id?: string;
  user_id: string;
  role: MessageRole;
  content: string;
  created_at?: string;
}

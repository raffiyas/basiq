/**
 * Utilidades para normalización y validación del check-in diario
 * Todas las funciones son determinísticas (no usan IA)
 */

import { DailyCheckinData, NormalizedCheckin } from './checkin-types';

/**
 * Normaliza los datos del check-in y calcula flags/scores
 */
export function normalizeCheckin(data: DailyCheckinData): NormalizedCheckin {
  const sleepHours = data.sleep_hours ?? 7;
  const sleepQuality = data.sleep_quality ?? 5;
  const energy = data.energy ?? 5;
  const stress = data.stress ?? 5;
  const trained = data.trained ?? false;
  const proteinHit = data.protein_hit ?? false;
  const dailyFocus = data.daily_focus ?? 'Entrenar';

  // Flags
  const sleep_deficit = sleepHours < 7;
  const high_stress = stress >= 7;
  const low_energy = energy <= 4;
  const hard_training = (data.rpe ?? 0) >= 8;

  // Recovery Score (0-100)
  // Formula: 40% sueño + 30% energía + 30% estrés (invertido)
  const sleepScore = Math.min(100, (sleepHours / 9) * 100); // 9h = 100%
  const sleepQualityBonus = (sleepQuality - 5) * 5; // ±25 pts
  const energyScore = (energy / 10) * 100;
  const stressScore = ((10 - stress) / 10) * 100; // Invertido

  const recovery_score = Math.round(
    sleepScore * 0.3 +
    sleepQualityBonus * 0.1 +
    energyScore * 0.3 +
    stressScore * 0.3
  );

  // Recomendación basada en reglas
  let suggested_action: NormalizedCheckin['suggested_action'] = 'normal';

  if (sleep_deficit && high_stress) {
    suggested_action = 'rest';
  } else if (low_energy || (stress >= 8)) {
    suggested_action = 'light';
  } else if (recovery_score >= 75 && !high_stress) {
    suggested_action = 'push';
  }

  return {
    date: data.date,
    sleep_hours: sleepHours,
    sleep_quality: sleepQuality,
    energy,
    stress,
    trained,
    training_type: data.training_type,
    training_minutes: data.training_minutes,
    rpe: data.rpe,
    protein_hit: proteinHit,
    protein_grams: data.protein_grams,
    daily_focus: dailyFocus,
    action_plan: data.action_plan,
    sleep_deficit,
    high_stress,
    low_energy,
    hard_training,
    recovery_score,
    suggested_action,
  };
}

/**
 * Valida un paso específico del wizard
 * Retorna true si el paso está completo
 */
export function validateStep(step: number, data: DailyCheckinData): boolean {
  switch (step) {
    case 1: // Sueño
      return (
        data.sleep_hours !== undefined &&
        data.sleep_hours >= 0 &&
        data.sleep_hours <= 24 &&
        data.sleep_quality !== undefined &&
        data.sleep_quality >= 1 &&
        data.sleep_quality <= 10
      );

    case 2: // Energía/Estrés
      return (
        data.energy !== undefined &&
        data.energy >= 1 &&
        data.energy <= 10 &&
        data.stress !== undefined &&
        data.stress >= 1 &&
        data.stress <= 10
      );

    case 3: // Entrenamiento
      if (data.trained === undefined) return false;
      if (!data.trained) return true; // Si no entrenó, válido
      // Si entrenó, necesita tipo
      return data.training_type !== undefined;

    case 4: // Nutrición
      return data.protein_hit !== undefined;

    case 5: // Intención
      return data.daily_focus !== undefined;

    default:
      return false;
  }
}

/**
 * Genera un mensaje de feedback basado en el check-in normalizado
 */
export function generateFeedback(checkin: NormalizedCheckin): {
  summary: string;
  recommendation: string;
} {
  const parts: string[] = [];

  // Sueño
  if (checkin.sleep_deficit) {
    parts.push(`Dormiste ${checkin.sleep_hours}h`);
  }

  // Entrenamiento
  if (checkin.trained && checkin.training_type) {
    parts.push(`Entrenaste ${checkin.training_type.toLowerCase()}`);
    if (checkin.hard_training) {
      parts.push('con alta intensidad');
    }
  }

  // Proteína
  if (!checkin.protein_hit) {
    parts.push('No cumpliste proteína');
  }

  const summary = parts.length > 0
    ? parts.join('. ') + '.'
    : 'Check-in completado.';

  // Recomendación
  let recommendation = '';

  switch (checkin.suggested_action) {
    case 'rest':
      recommendation = 'Descanso obligatorio. Reducir volumen o suspender entrenamiento.';
      break;
    case 'light':
      recommendation = 'Entrenamiento liviano únicamente. RPE máximo 5.';
      break;
    case 'normal':
      recommendation = 'Seguir el plan establecido. Condiciones estándar.';
      break;
    case 'push':
      recommendation = 'Recuperación óptima. Aumentar intensidad si el plan lo permite.';
      break;
  }

  if (checkin.sleep_deficit && checkin.recovery_score < 50) {
    recommendation = 'Dormir más esta noche. Prioridad absoluta.';
  }

  return { summary, recommendation };
}

/**
 * Helpers para formatear valores
 */
export function formatSleepHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatRPE(rpe: number): string {
  if (rpe <= 3) return 'Muy liviano';
  if (rpe <= 5) return 'Liviano';
  if (rpe <= 7) return 'Moderado';
  if (rpe <= 9) return 'Duro';
  return 'Máximo';
}

import { CoachFlags } from './rules';
import { CoachTone, DailyCheckin, Profile } from '@/lib/types';

export interface CoachReply {
  hechos: string;
  interpretacion: string;
  accion: string;
  limite: string;
}

export function generateCoachReply(
  question: string,
  flags: CoachFlags,
  recentCheckins: DailyCheckin[],
  todayCheckin: DailyCheckin | null,
  profile: Profile | null,
  tone: CoachTone = 'directo'
): CoachReply {
  const checkinCount = recentCheckins.length;
  const trainedDays = recentCheckins.filter(c => c.trained).length;

  // Default reply structure
  let hechos = `Últimos 7 días: ${checkinCount} check-ins, ${trainedDays} entrenamientos.`;
  let interpretacion = 'Datos completos. No hay señales de alarma.';
  let accion = 'Sigue el plan establecido. Ajusta solo si cambian las condiciones.';
  let limite = 'No modifiques si no hay razón objetiva para hacerlo.';

  // Customize based on flags
  if (flags.fatigue_high) {
    hechos = `${checkinCount} check-ins. Sueño bajo en 2+ días o energía ≤4.`;
    interpretacion = 'Fatiga acumulada. Tu rendimiento está limitado.';
    accion = 'Dormir 7-8h esta noche. Reducir intensidad hoy a RPE 5 o menos.';
    limite = tone === 'estricto'
      ? 'Sin recuperación, no entrenes. Descanso no es opcional.'
      : 'Recuperación deficiente limita todos los resultados.';
  }

  if (flags.adherence_low) {
    hechos = `${checkinCount} check-ins en 7 días. ${trainedDays} entrenamientos.`;
    interpretacion = 'Adherencia baja. Sin datos suficientes para optimizar.';
    accion = 'Check-in diario obligatorio. Entrenar mínimo 3 sesiones esta semana.';
    limite = tone === 'estricto'
      ? 'Sin registro no hay plan. Haz el check-in o trabaja solo.'
      : 'Ajustes requieren datos. No hay datos sin check-ins.';
  }

  if (flags.protein_low) {
    hechos = `Proteína no cumplida en 3+ días de los últimos 7.`;
    interpretacion = 'Déficit de proteína compromete composición corporal.';
    accion = `${profile?.protein_target_g || 100}g diarios obligatorios. Prepara comidas con anticipación.`;
    limite = tone === 'estricto'
      ? 'Proteína insuficiente anula los entrenamientos. No negociable.'
      : 'Sin proteína adecuada no hay cambios en composición corporal.';
  }

  if (flags.all_good) {
    hechos = `${checkinCount} check-ins, ${trainedDays} entrenamientos. Métricas dentro de rango.`;
    interpretacion = 'Sin señales de alarma. Plan funcionando.';
    accion = 'No cambies nada. Monitorea fatiga semanalmente.';
    limite = 'Mientras funcione, no ajustes.';
  }

  return { hechos, interpretacion, accion, limite };
}

export function getDefaultCoachTip(): string {
  return 'Registra sueño, entrenamiento y proteína. El resto es ruido.';
}

/**
 * Generates a daily coach message after check-in completion.
 * Format: Summary (1 sentence) + 3 actions + Optional reason.
 * B1 tone: serious, human, honest, supportive but not indulgent.
 */
export function generateDailyCoachMessage(
  flags: CoachFlags,
  recentCheckins: DailyCheckin[],
  todayCheckin: DailyCheckin | null,
  profile: Profile | null
): string {
  const checkinCount = recentCheckins.length;
  const trainedDays = recentCheckins.filter(c => c.trained).length;
  const proteinTarget = profile?.protein_target_g || 100;

  let summary = '';
  const actions: string[] = [];
  let reason = '';

  // Priority 1: High Fatigue
  if (flags.fatigue_high) {
    const lowSleepDays = recentCheckins.filter(c => c.sleep_hours && c.sleep_hours < 6).length;
    const avgEnergy = recentCheckins.length > 0
      ? recentCheckins.reduce((sum, c) => sum + (c.energy || 5), 0) / recentCheckins.length
      : 5;

    summary = lowSleepDays >= 2
      ? `Has dormido menos de 6 horas en ${lowSleepDays} días esta semana.`
      : `Tu energía promedio es ${avgEnergy.toFixed(1)}/10 esta semana.`;

    actions.push('Dormir 7-8h esta noche');
    actions.push('Reducir intensidad de entrenamiento a RPE 5 o menos');
    actions.push(`Cumplir meta de proteína hoy (${proteinTarget}g)`);

    reason = 'La fatiga acumulada limita tu capacidad de recuperación y rendimiento.';
  }
  // Priority 2: Low Adherence
  else if (flags.adherence_low) {
    const expectedTrainingDays = profile?.training_days_per_week || 3;

    if (checkinCount < 4) {
      summary = `Solo has registrado ${checkinCount} check-ins en los últimos 7 días.`;
    } else {
      summary = `Has entrenado ${trainedDays} días esta semana, tu meta es ${expectedTrainingDays}.`;
    }

    actions.push('Hacer check-in diario sin excusas');
    actions.push(`Completar mínimo ${expectedTrainingDays} entrenamientos esta semana`);
    actions.push('Planificar las sesiones de entrenamiento con anticipación');

    reason = 'Sin datos consistentes y volumen adecuado no hay progreso.';
  }
  // Priority 3: Low Protein
  else if (flags.protein_low) {
    const proteinMissedDays = recentCheckins.filter(c => c.protein_hit === false).length;

    summary = `No has cumplido tu meta de proteína en ${proteinMissedDays} días esta semana.`;

    actions.push(`Consumir ${proteinTarget}g de proteína hoy`);
    actions.push('Preparar 3 comidas con fuente de proteína clara');
    actions.push('Llevar registro de proteína en cada comida');

    reason = 'Sin proteína adecuada no hay cambios en composición corporal.';
  }
  // All Good
  else if (flags.all_good) {
    summary = `Has completado ${checkinCount} check-ins y ${trainedDays} entrenamientos esta semana.`;

    actions.push('Mantener el plan actual sin cambios');
    actions.push('Monitorear nivel de fatiga diariamente');
    actions.push('Ajustar solo si las condiciones cambian');

    reason = 'El plan está funcionando, la consistencia genera resultados.';
  }
  // Fallback (should not happen if flags are computed correctly)
  else {
    summary = 'Check-in completado.';
    actions.push('Seguir el plan establecido');
    actions.push('Registrar métricas diariamente');
    actions.push('Mantener adherencia al entrenamiento');
    reason = '';
  }

  // Format message
  let message = summary + '\n\n';
  actions.slice(0, 3).forEach((action, index) => {
    message += `${index + 1}. ${action}\n`;
  });

  if (reason) {
    message += `\n${reason}`;
  }

  return message.trim();
}

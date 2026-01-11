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

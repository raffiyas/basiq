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
  let interpretacion = 'Progreso estable.';
  let accion = 'Continúa con tu rutina actual.';
  let limite = 'Hoy no toca heroísmo. Prioriza consistencia.';

  // Customize based on flags
  if (flags.fatigue_high) {
    hechos = `${checkinCount} check-ins. Sueño bajo en 2+ días o energía ≤4.`;
    interpretacion = 'Fatiga acumulada afecta tu rendimiento.';
    accion = 'Prioriza dormir 7-8h esta noche. Reduce intensidad hoy.';
    limite = tone === 'estricto'
      ? 'Sin descanso, no hay progreso. No negociable.'
      : 'El descanso es parte del entrenamiento.';
  }

  if (flags.adherence_low) {
    hechos = `${checkinCount} check-ins en 7 días. ${trainedDays} entrenamientos.`;
    interpretacion = 'Adherencia baja. Sin datos, no puedo ajustar.';
    accion = 'Haz el check-in diario. Entrena mínimo 3 días esta semana.';
    limite = tone === 'estricto'
      ? 'Si no registras, no puedo ayudarte. Haz el check-in.'
      : 'La consistencia es más importante que la intensidad.';
  }

  if (flags.protein_low) {
    hechos = `Proteína no cumplida en 3+ días de los últimos 7.`;
    interpretacion = 'Sin proteína suficiente, el progreso se frena.';
    accion = `Asegura ${profile?.protein_target_g || 100}g hoy. Prepara tus comidas.`;
    limite = tone === 'estricto'
      ? 'Sin proteína suficiente, entrenas para nada. Resuélvelo.'
      : 'La proteína es la base. Priorízala.';
  }

  if (flags.all_good) {
    hechos = `${checkinCount} check-ins, ${trainedDays} entrenamientos. Todo en orden.`;
    interpretacion = 'Progreso sólido. Sigue así.';
    accion = 'Mantén la consistencia. Ajusta si sientes fatiga.';
    limite = 'Consistencia > perfección.';
  }

  return { hechos, interpretacion, accion, limite };
}

export function getDefaultCoachTip(): string {
  return 'Empieza por lo medible: sueño, entrenamiento y proteína. El resto viene después.';
}

import { CoachFlags } from './rules';

export function getFocusActions(flags: CoachFlags, hasCheckedInToday: boolean): string[] {
  if (!hasCheckedInToday) {
    return ['Haz el check-in para ajustar el plan.'];
  }

  const actions: string[] = [];

  if (flags.fatigue_high) {
    actions.push('Prioriza dormir 7-8h esta noche.');
  }

  if (flags.protein_low) {
    actions.push('Asegura tu proteína diaria hoy.');
  }

  if (flags.adherence_low) {
    actions.push('Mantén la consistencia en tus entrenamientos.');
  }

  if (flags.all_good) {
    return ['Todo en orden. Sigue así.'];
  }

  return actions.length > 0 ? actions.slice(0, 3) : ['Continúa con tu rutina.'];
}

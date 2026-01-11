import { CoachFlags } from './rules';

export function getFocusActions(flags: CoachFlags, hasCheckedInToday: boolean): string[] {
  if (!hasCheckedInToday) {
    return ['Haz el check-in para definir el plan de hoy.'];
  }

  const actions: string[] = [];

  if (flags.fatigue_high) {
    actions.push('Dormir 7-8h esta noche.');
  }

  if (flags.protein_low) {
    actions.push('Cumplir meta de proteína hoy.');
  }

  if (flags.adherence_low) {
    actions.push('Completar mínimo 3 entrenamientos esta semana.');
  }

  if (flags.all_good) {
    return ['Seguir el plan actual sin cambios.'];
  }

  return actions.length > 0 ? actions.slice(0, 3) : ['Seguir el plan establecido.'];
}

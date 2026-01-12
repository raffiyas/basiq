/**
 * Biblioteca de ejercicios predefinidos
 * Organizado por grupo muscular y tipo de entrenamiento
 */

import { Exercise } from './types';

export const EXERCISES: Exercise[] = [
  // ============================================
  // PECHO
  // ============================================
  {
    id: 'push-up',
    name: 'Flexiones',
    description: 'Ejercicio básico de empuje para pecho, hombros y tríceps.',
    instructions: [
      'Colócate en posición de plancha con manos a la altura de los hombros',
      'Baja el cuerpo manteniendo el core activado',
      'Empuja hacia arriba hasta extender los brazos',
    ],
    muscle_groups: ['pecho', 'triceps', 'hombros'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
    tips: ['Mantén el cuerpo en línea recta', 'No dejes caer las caderas'],
  },
  {
    id: 'bench-press-db',
    name: 'Press de banca con mancuernas',
    description: 'Press horizontal para desarrollo de pecho.',
    instructions: [
      'Acuéstate en una banca plana con una mancuerna en cada mano',
      'Baja las mancuernas hasta que los codos formen 90 grados',
      'Empuja hacia arriba contrayendo el pecho',
    ],
    muscle_groups: ['pecho', 'triceps', 'hombros'],
    equipment: ['mancuernas', 'banca'],
    difficulty: 'intermedio',
    training_type: 'Fuerza',
    location: ['Gym', 'Mixto'],
    tips: ['Retrae los omóplatos', 'Controla el movimiento en la bajada'],
  },
  {
    id: 'incline-push-up',
    name: 'Flexiones inclinadas',
    description: 'Variación más fácil de flexiones con manos elevadas.',
    instructions: [
      'Coloca las manos en una superficie elevada (banca, escalón)',
      'Realiza flexiones manteniendo el cuerpo recto',
      'Ideal para principiantes o días de recuperación',
    ],
    muscle_groups: ['pecho', 'triceps'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
  },

  // ============================================
  // ESPALDA
  // ============================================
  {
    id: 'row-db',
    name: 'Remo con mancuerna',
    description: 'Ejercicio de tracción unilateral para espalda.',
    instructions: [
      'Apoya una mano y rodilla en una banca',
      'Con la otra mano, tira la mancuerna hacia la cadera',
      'Baja controladamente y repite',
    ],
    muscle_groups: ['espalda', 'biceps'],
    equipment: ['mancuernas', 'banca'],
    difficulty: 'intermedio',
    training_type: 'Fuerza',
    location: ['Gym', 'Casa', 'Mixto'],
    tips: ['Mantén la espalda recta', 'No rotes el torso'],
  },
  {
    id: 'pull-up',
    name: 'Dominadas',
    description: 'Ejercicio de tracción vertical con peso corporal.',
    instructions: [
      'Cuélgate de una barra con agarre prono (palmas hacia afuera)',
      'Tira del cuerpo hacia arriba hasta que la barbilla pase la barra',
      'Baja controladamente',
    ],
    muscle_groups: ['espalda', 'biceps'],
    equipment: ['barra'],
    difficulty: 'avanzado',
    training_type: 'Fuerza',
    location: ['Gym', 'Casa', 'Mixto'],
    tips: ['Si no puedes hacer una, usa banda de asistencia'],
  },
  {
    id: 'superman',
    name: 'Superman',
    description: 'Ejercicio para espalda baja y core.',
    instructions: [
      'Acuéstate boca abajo con brazos extendidos',
      'Levanta brazos y piernas del suelo simultáneamente',
      'Mantén 2-3 segundos y baja',
    ],
    muscle_groups: ['espalda', 'core'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
  },

  // ============================================
  // HOMBROS
  // ============================================
  {
    id: 'shoulder-press-db',
    name: 'Press de hombros con mancuernas',
    description: 'Press vertical para deltoides.',
    instructions: [
      'Siéntate o párate con una mancuerna en cada mano a la altura de los hombros',
      'Empuja hacia arriba hasta extender los brazos',
      'Baja controladamente',
    ],
    muscle_groups: ['hombros', 'triceps'],
    equipment: ['mancuernas'],
    difficulty: 'intermedio',
    training_type: 'Fuerza',
    location: ['Gym', 'Casa', 'Mixto'],
  },
  {
    id: 'lateral-raise',
    name: 'Elevaciones laterales',
    description: 'Aislamiento para deltoides lateral.',
    instructions: [
      'De pie con mancuernas a los lados',
      'Eleva los brazos hacia los lados hasta la altura de los hombros',
      'Baja controladamente',
    ],
    muscle_groups: ['hombros'],
    equipment: ['mancuernas'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Gym', 'Casa', 'Mixto'],
    tips: ['Usa peso ligero', 'No balancees el cuerpo'],
  },
  {
    id: 'pike-push-up',
    name: 'Flexiones pike',
    description: 'Flexiones con énfasis en hombros.',
    instructions: [
      'Posición de V invertida con caderas arriba',
      'Baja la cabeza hacia el suelo flexionando los codos',
      'Empuja hacia arriba',
    ],
    muscle_groups: ['hombros', 'triceps'],
    equipment: ['ninguno'],
    difficulty: 'intermedio',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
  },

  // ============================================
  // BRAZOS
  // ============================================
  {
    id: 'bicep-curl-db',
    name: 'Curl de bíceps con mancuernas',
    description: 'Ejercicio de aislamiento para bíceps.',
    instructions: [
      'De pie con mancuernas a los lados, palmas hacia adelante',
      'Flexiona los codos llevando las mancuernas hacia los hombros',
      'Baja controladamente',
    ],
    muscle_groups: ['biceps'],
    equipment: ['mancuernas'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Gym', 'Casa', 'Mixto'],
  },
  {
    id: 'tricep-dip',
    name: 'Fondos de tríceps',
    description: 'Ejercicio para tríceps usando peso corporal.',
    instructions: [
      'Apoya las manos en una banca o silla detrás de ti',
      'Baja el cuerpo flexionando los codos',
      'Empuja hacia arriba extendiendo los brazos',
    ],
    muscle_groups: ['triceps'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'hammer-curl',
    name: 'Curl martillo',
    description: 'Variación de curl para bíceps y antebrazo.',
    instructions: [
      'De pie con mancuernas a los lados, palmas mirándose',
      'Flexiona los codos manteniendo las palmas neutras',
      'Baja controladamente',
    ],
    muscle_groups: ['biceps'],
    equipment: ['mancuernas'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Gym', 'Casa', 'Mixto'],
  },

  // ============================================
  // PIERNAS
  // ============================================
  {
    id: 'squat-bodyweight',
    name: 'Sentadilla',
    description: 'Ejercicio fundamental para piernas.',
    instructions: [
      'De pie con pies a la anchura de los hombros',
      'Baja como si fueras a sentarte, manteniendo el pecho arriba',
      'Sube empujando desde los talones',
    ],
    muscle_groups: ['cuadriceps', 'gluteos', 'isquiotibiales'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
    tips: ['Rodillas en línea con los pies', 'No dejes que las rodillas colapsen hacia adentro'],
  },
  {
    id: 'goblet-squat',
    name: 'Sentadilla goblet',
    description: 'Sentadilla con peso al frente.',
    instructions: [
      'Sostén una mancuerna o kettlebell frente al pecho',
      'Realiza una sentadilla profunda',
      'Mantén el torso erguido durante todo el movimiento',
    ],
    muscle_groups: ['cuadriceps', 'gluteos', 'core'],
    equipment: ['mancuernas', 'kettlebell'],
    difficulty: 'intermedio',
    training_type: 'Fuerza',
    location: ['Gym', 'Casa', 'Mixto'],
  },
  {
    id: 'lunge',
    name: 'Zancadas',
    description: 'Ejercicio unilateral para piernas.',
    instructions: [
      'Da un paso adelante y baja la rodilla trasera hacia el suelo',
      'Empuja con la pierna delantera para volver a la posición inicial',
      'Alterna piernas',
    ],
    muscle_groups: ['cuadriceps', 'gluteos', 'isquiotibiales'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'romanian-deadlift-db',
    name: 'Peso muerto rumano con mancuernas',
    description: 'Ejercicio para isquiotibiales y glúteos.',
    instructions: [
      'De pie con mancuernas frente a los muslos',
      'Inclínate hacia adelante desde las caderas, bajando las mancuernas',
      'Mantén las piernas casi rectas y la espalda plana',
    ],
    muscle_groups: ['isquiotibiales', 'gluteos', 'espalda'],
    equipment: ['mancuernas'],
    difficulty: 'intermedio',
    training_type: 'Fuerza',
    location: ['Gym', 'Casa', 'Mixto'],
    tips: ['Siente el estiramiento en los isquiotibiales', 'No redondees la espalda'],
  },
  {
    id: 'glute-bridge',
    name: 'Puente de glúteos',
    description: 'Ejercicio de activación de glúteos.',
    instructions: [
      'Acuéstate boca arriba con rodillas flexionadas',
      'Empuja las caderas hacia arriba apretando los glúteos',
      'Baja controladamente',
    ],
    muscle_groups: ['gluteos', 'isquiotibiales'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'calf-raise',
    name: 'Elevación de talones',
    description: 'Ejercicio para pantorrillas.',
    instructions: [
      'De pie, eleva los talones lo más alto posible',
      'Mantén un segundo arriba',
      'Baja controladamente',
    ],
    muscle_groups: ['pantorrillas'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
  },

  // ============================================
  // CORE
  // ============================================
  {
    id: 'plank',
    name: 'Plancha',
    description: 'Ejercicio isométrico para core.',
    instructions: [
      'Posición de plancha sobre antebrazos',
      'Mantén el cuerpo en línea recta',
      'Aguanta el tiempo indicado',
    ],
    muscle_groups: ['core'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
    tips: ['No dejes caer las caderas', 'Aprieta glúteos y abdomen'],
  },
  {
    id: 'dead-bug',
    name: 'Dead bug',
    description: 'Ejercicio de estabilización de core.',
    instructions: [
      'Acuéstate boca arriba con brazos extendidos y rodillas a 90°',
      'Extiende un brazo y la pierna opuesta simultáneamente',
      'Vuelve al centro y alterna',
    ],
    muscle_groups: ['core'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
    tips: ['Mantén la espalda baja pegada al suelo'],
  },
  {
    id: 'mountain-climber',
    name: 'Mountain climbers',
    description: 'Ejercicio de core con componente cardiovascular.',
    instructions: [
      'Posición de plancha alta',
      'Lleva una rodilla hacia el pecho',
      'Alterna rápidamente las piernas',
    ],
    muscle_groups: ['core', 'cardio'],
    equipment: ['ninguno'],
    difficulty: 'intermedio',
    training_type: 'Mixto',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'russian-twist',
    name: 'Giros rusos',
    description: 'Ejercicio rotacional para oblicuos.',
    instructions: [
      'Siéntate con rodillas flexionadas y torso inclinado hacia atrás',
      'Gira el torso llevando las manos de un lado al otro',
      'Mantén el core activado todo el tiempo',
    ],
    muscle_groups: ['core'],
    equipment: ['ninguno'],
    difficulty: 'intermedio',
    training_type: 'Fuerza',
    location: ['Casa', 'Gym', 'Mixto'],
  },

  // ============================================
  // CARDIO
  // ============================================
  {
    id: 'jumping-jack',
    name: 'Jumping jacks',
    description: 'Ejercicio cardiovascular de cuerpo completo.',
    instructions: [
      'De pie con pies juntos y brazos a los lados',
      'Salta abriendo piernas y llevando brazos arriba',
      'Vuelve a la posición inicial saltando',
    ],
    muscle_groups: ['cardio', 'full_body'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Cardio',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'burpee',
    name: 'Burpees',
    description: 'Ejercicio de alta intensidad para todo el cuerpo.',
    instructions: [
      'De pie, baja a posición de sentadilla con manos al suelo',
      'Salta los pies hacia atrás a posición de plancha',
      'Haz una flexión, salta los pies hacia adelante y salta arriba',
    ],
    muscle_groups: ['full_body', 'cardio'],
    equipment: ['ninguno'],
    difficulty: 'avanzado',
    training_type: 'Cardio',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'high-knees',
    name: 'Rodillas altas',
    description: 'Ejercicio cardiovascular en el lugar.',
    instructions: [
      'Corre en el lugar llevando las rodillas lo más alto posible',
      'Mantén un ritmo constante',
      'Usa los brazos para momentum',
    ],
    muscle_groups: ['cardio', 'core'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Cardio',
    location: ['Casa', 'Gym', 'Mixto'],
  },

  // ============================================
  // MOVILIDAD / RECUPERACIÓN
  // ============================================
  {
    id: 'cat-cow',
    name: 'Gato-vaca',
    description: 'Movilidad de columna.',
    instructions: [
      'En cuatro puntos, arquea la espalda hacia arriba (gato)',
      'Luego deja caer el abdomen y mira hacia arriba (vaca)',
      'Alterna fluidamente',
    ],
    muscle_groups: ['espalda', 'core'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Movilidad',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'hip-flexor-stretch',
    name: 'Estiramiento de flexor de cadera',
    description: 'Estiramiento para psoas y flexores.',
    instructions: [
      'Posición de zancada con rodilla trasera en el suelo',
      'Empuja las caderas hacia adelante suavemente',
      'Mantén 30 segundos por lado',
    ],
    muscle_groups: ['cuadriceps', 'core'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Movilidad',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'world-greatest-stretch',
    name: 'World\'s greatest stretch',
    description: 'Estiramiento dinámico completo.',
    instructions: [
      'Desde zancada, coloca la mano del lado de la pierna adelantada al suelo',
      'Rota el torso y extiende el brazo hacia el techo',
      'Vuelve y repite del otro lado',
    ],
    muscle_groups: ['full_body'],
    equipment: ['ninguno'],
    difficulty: 'intermedio',
    training_type: 'Movilidad',
    location: ['Casa', 'Gym', 'Mixto'],
  },
  {
    id: 'childs-pose',
    name: 'Postura del niño',
    description: 'Estiramiento de espalda y relajación.',
    instructions: [
      'Arrodillado, siéntate sobre los talones',
      'Extiende los brazos hacia adelante y baja el torso',
      'Respira profundo y relaja',
    ],
    muscle_groups: ['espalda', 'hombros'],
    equipment: ['ninguno'],
    difficulty: 'principiante',
    training_type: 'Movilidad',
    location: ['Casa', 'Gym', 'Mixto'],
  },
];

/**
 * Obtener ejercicio por ID
 */
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find(e => e.id === id);
}

/**
 * Filtrar ejercicios por criterios
 */
export function filterExercises(criteria: {
  muscle_groups?: string[];
  equipment?: string[];
  difficulty?: string;
  training_type?: string;
  location?: string;
}): Exercise[] {
  return EXERCISES.filter(exercise => {
    if (criteria.muscle_groups?.length) {
      const hasGroup = criteria.muscle_groups.some(g =>
        exercise.muscle_groups.includes(g as any)
      );
      if (!hasGroup) return false;
    }

    if (criteria.equipment?.length) {
      const hasEquipment = criteria.equipment.some(e =>
        exercise.equipment.includes(e as any)
      );
      if (!hasEquipment) return false;
    }

    if (criteria.difficulty && exercise.difficulty !== criteria.difficulty) {
      return false;
    }

    if (criteria.training_type && exercise.training_type !== criteria.training_type) {
      return false;
    }

    if (criteria.location) {
      if (!exercise.location.includes(criteria.location as any)) {
        return false;
      }
    }

    return true;
  });
}

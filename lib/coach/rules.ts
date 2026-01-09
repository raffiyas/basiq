import { DailyCheckin, Profile } from '@/lib/types';

export interface CoachFlags {
  fatigue_high: boolean;
  adherence_low: boolean;
  protein_low: boolean;
  all_good: boolean;
}

export function computeFlags(
  recentCheckins: DailyCheckin[],
  todayCheckin: DailyCheckin | null,
  profile: Profile | null
): CoachFlags {
  const flags: CoachFlags = {
    fatigue_high: false,
    adherence_low: false,
    protein_low: false,
    all_good: false,
  };

  // Check fatigue
  const lowSleepDays = recentCheckins.filter(c => c.sleep_hours && c.sleep_hours < 6).length;
  const lowEnergyDays = recentCheckins.filter(c => c.energy && c.energy <= 4).length;
  flags.fatigue_high = lowSleepDays >= 2 || lowEnergyDays >= 2;

  // Check adherence
  const checkinCount = recentCheckins.length;
  const trainedDays = recentCheckins.filter(c => c.trained).length;
  const expectedTrainingDays = profile?.training_days_per_week || 3;
  flags.adherence_low = checkinCount < 4 || trainedDays < (expectedTrainingDays - 1);

  // Check protein
  const proteinMissedDays = recentCheckins.filter(c => c.protein_hit === false).length;
  flags.protein_low = proteinMissedDays >= 3;

  // All good if no flags
  flags.all_good = !flags.fatigue_high && !flags.adherence_low && !flags.protein_low;

  return flags;
}

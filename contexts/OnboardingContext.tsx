import React, { createContext, useContext, useState } from 'react';
import { Profile, Goal, ActivityLevel, TrainingLocation, NutritionMode } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface OnboardingData {
  // Step 1: Profile
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  goal?: Goal;
  activity_level?: ActivityLevel;
  // Step 2: Training
  training_days_per_week?: number;
  session_duration_min?: number;
  training_location?: TrainingLocation;
  injuries_notes?: string;
  // Step 3: Nutrition
  nutrition_mode?: NutritionMode;
  protein_target_g?: number;
  first_meal_time?: string;
  last_meal_time?: string;
  fasting_12h?: boolean;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  saveProfile: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<OnboardingData>({});

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const saveProfile = async () => {
    if (!user) throw new Error('No user found');

    const profile: Omit<Profile, 'created_at' | 'updated_at'> = {
      user_id: user.id,
      age: data.age,
      height_cm: data.height_cm,
      weight_kg: data.weight_kg,
      goal: data.goal,
      activity_level: data.activity_level,
      training_days_per_week: data.training_days_per_week,
      session_duration_min: data.session_duration_min,
      training_location: data.training_location,
      injuries_notes: data.injuries_notes,
      nutrition_mode: data.nutrition_mode,
      protein_target_g: data.protein_target_g,
      first_meal_time: data.first_meal_time,
      last_meal_time: data.last_meal_time,
      fasting_12h: data.fasting_12h,
      coach_tone: 'directo',
    };

    const { error } = await supabase
      .from('profile')
      .upsert(profile, { onConflict: 'user_id' });

    if (error) throw error;
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, saveProfile }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

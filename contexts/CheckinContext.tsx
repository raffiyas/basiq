import React, { createContext, useContext, useState } from 'react';
import { DailyCheckin } from '@/lib/types';
import { DailyCheckinData, NormalizedCheckin } from '@/lib/checkin-types';
import { normalizeCheckin, validateStep } from '@/lib/checkin-utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface CheckinContextType {
  data: DailyCheckinData;
  updateData: (newData: Partial<DailyCheckinData>) => void;
  validateStep: (step: number) => boolean;
  getNormalized: () => NormalizedCheckin;
  saveCheckin: () => Promise<void>;
}

const CheckinContext = createContext<CheckinContextType | undefined>(undefined);

export function CheckinProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<DailyCheckinData>({
    date: new Date().toISOString().split('T')[0],
  });

  const updateData = (newData: Partial<DailyCheckinData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const validateCurrentStep = (step: number): boolean => {
    return validateStep(step, data);
  };

  const getNormalized = (): NormalizedCheckin => {
    return normalizeCheckin(data);
  };

  const saveCheckin = async () => {
    if (!user) throw new Error('No user found');

    // Guardar solo campos relevantes del nuevo modelo
    const checkin: Omit<DailyCheckin, 'id' | 'created_at'> = {
      user_id: user.id,
      date: data.date,
      sleep_hours: data.sleep_hours,
      sleep_quality: data.sleep_quality,
      energy: data.energy,
      stress: data.stress,
      mood: undefined, // Ya no lo usamos
      pain_level: undefined, // Ya no lo usamos
      pain_area: undefined,
      weight_kg: undefined,
      trained: data.trained,
      training_type: data.training_type,
      training_minutes: data.training_minutes,
      rpe: data.rpe,
      protein_hit: data.protein_hit,
      veggies_hit: undefined, // Ya no lo usamos
      water_hit: undefined,
      note: data.action_plan, // Mapeamos action_plan a note
      tomorrow_plan: undefined,
    };

    const { error } = await supabase
      .from('daily_checkins')
      .upsert(checkin, { onConflict: 'user_id,date' });

    if (error) throw error;
  };

  return (
    <CheckinContext.Provider value={{
      data,
      updateData,
      validateStep: validateCurrentStep,
      getNormalized,
      saveCheckin
    }}>
      {children}
    </CheckinContext.Provider>
  );
}

export function useCheckin() {
  const context = useContext(CheckinContext);
  if (context === undefined) {
    throw new Error('useCheckin must be used within a CheckinProvider');
  }
  return context;
}

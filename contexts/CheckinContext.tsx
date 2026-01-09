import React, { createContext, useContext, useState } from 'react';
import { DailyCheckin, TrainingType } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface CheckinData {
  date: string;
  // Step 1
  sleep_hours?: number;
  sleep_quality?: number;
  energy?: number;
  stress?: number;
  mood?: number;
  // Step 2
  pain_level?: number;
  pain_area?: string;
  weight_kg?: number;
  // Step 3
  trained?: boolean;
  training_type?: TrainingType;
  training_minutes?: number;
  rpe?: number;
  // Step 4
  protein_hit?: boolean;
  veggies_hit?: boolean;
  water_hit?: boolean;
  // Step 5
  note?: string;
  tomorrow_plan?: string;
}

interface CheckinContextType {
  data: CheckinData;
  updateData: (newData: Partial<CheckinData>) => void;
  saveCheckin: () => Promise<void>;
}

const CheckinContext = createContext<CheckinContextType | undefined>(undefined);

export function CheckinProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<CheckinData>({
    date: new Date().toISOString().split('T')[0],
  });

  const updateData = (newData: Partial<CheckinData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const saveCheckin = async () => {
    if (!user) throw new Error('No user found');

    const checkin: Omit<DailyCheckin, 'id' | 'created_at'> = {
      user_id: user.id,
      date: data.date,
      sleep_hours: data.sleep_hours,
      sleep_quality: data.sleep_quality,
      energy: data.energy,
      stress: data.stress,
      mood: data.mood,
      pain_level: data.pain_level,
      pain_area: data.pain_area,
      weight_kg: data.weight_kg,
      trained: data.trained,
      training_type: data.training_type,
      training_minutes: data.training_minutes,
      rpe: data.rpe,
      protein_hit: data.protein_hit,
      veggies_hit: data.veggies_hit,
      water_hit: data.water_hit,
      note: data.note,
      tomorrow_plan: data.tomorrow_plan,
    };

    const { error } = await supabase
      .from('daily_checkins')
      .upsert(checkin, { onConflict: 'user_id,date' });

    if (error) throw error;
  };

  return (
    <CheckinContext.Provider value={{ data, updateData, saveCheckin }}>
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

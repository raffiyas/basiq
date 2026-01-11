import React, { createContext, useContext, useState } from 'react';
import { DailyCheckin, Profile } from '@/lib/types';
import { DailyCheckinData, NormalizedCheckin } from '@/lib/checkin-types';
import { normalizeCheckin, validateStep } from '@/lib/checkin-utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { computeFlags } from '@/lib/coach/rules';
import { generateDailyCoachMessage } from '@/lib/coach/coachReply';

interface CheckinContextType {
  data: DailyCheckinData;
  updateData: (newData: Partial<DailyCheckinData>) => void;
  validateStep: (step: number, dataOverride?: Partial<DailyCheckinData>) => boolean;
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

  const validateCurrentStep = (step: number, dataOverride?: Partial<DailyCheckinData>): boolean => {
    const mergedData = dataOverride ? { ...data, ...dataOverride } : data;
    return validateStep(step, mergedData);
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

    // Generate and save daily coach message
    try {
      // Fetch recent check-ins (last 7 days including today)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentCheckins, error: checkinsError } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (checkinsError) throw checkinsError;

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // Ignore "not found" error, but throw others
        throw profileError;
      }

      // Compute flags
      const todayCheckin = recentCheckins?.find(c => c.date === data.date) || null;
      const flags = computeFlags(
        recentCheckins || [],
        todayCheckin,
        profile as Profile | null
      );

      // Generate daily coach message
      const message = generateDailyCoachMessage(
        flags,
        recentCheckins || [],
        todayCheckin,
        profile as Profile | null
      );

      // Save message to coach_messages table
      const { error: messageError } = await supabase
        .from('coach_messages')
        .insert({
          user_id: user.id,
          role: 'assistant',
          content: message,
        });

      if (messageError) {
        console.error('Failed to save coach message:', messageError);
        // Don't throw - we don't want to block check-in if message fails
      }
    } catch (coachError) {
      console.error('Failed to generate coach message:', coachError);
      // Don't throw - we don't want to block check-in if coach message fails
    }
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

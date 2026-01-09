import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DailyCheckin } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export function useTodayCheckin() {
  const { user } = useAuth();
  const [checkin, setCheckin] = useState<DailyCheckin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setCheckin(null);
      setLoading(false);
      return;
    }

    const fetchTodayCheckin = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('daily_checkins')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle();

        if (error) throw error;
        setCheckin(data);
      } catch (err) {
        setError(err as Error);
        setCheckin(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayCheckin();
  }, [user, today]);

  const refresh = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      setCheckin(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { checkin, loading, error, refresh };
}

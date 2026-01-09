import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DailyCheckin } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export function useRecentCheckins(days: number = 7) {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setCheckins([]);
      setLoading(false);
      return;
    }

    const fetchRecentCheckins = async () => {
      try {
        setLoading(true);

        // Calculate the date 'days' ago
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('daily_checkins')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDateStr)
          .order('date', { ascending: false });

        if (error) throw error;
        setCheckins(data || []);
      } catch (err) {
        setError(err as Error);
        setCheckins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCheckins();
  }, [user, days]);

  const refresh = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .order('date', { ascending: false });

      if (error) throw error;
      setCheckins(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { checkins, loading, error, refresh };
}

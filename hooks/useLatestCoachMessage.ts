import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface CoachMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export function useLatestCoachMessage() {
  const { user } = useAuth();
  const [message, setMessage] = useState<CoachMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setMessage(null);
      setLoading(false);
      return;
    }

    const fetchLatestMessage = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('coach_messages')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'assistant')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setMessage(data);
      } catch (err) {
        setError(err as Error);
        setMessage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMessage();

    // Subscribe to new messages
    const subscription = supabase
      .channel('coach_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coach_messages',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Only update if the new message is from assistant
          if (payload.new && (payload.new as CoachMessage).role === 'assistant') {
            setMessage(payload.new as CoachMessage);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const refresh = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'assistant')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setMessage(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { message, loading, error, refresh };
}

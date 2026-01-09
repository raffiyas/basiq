import { useEffect } from 'react';
import { router } from 'expo-router';

export default function CheckinTabScreen() {
  useEffect(() => {
    router.push('/checkin');
  }, []);

  return null;
}

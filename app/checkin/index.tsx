import { useEffect } from 'react';
import { router } from 'expo-router';

export default function CheckinIndex() {
  useEffect(() => {
    router.replace('/checkin/step-1');
  }, []);

  return null;
}

import { Stack } from 'expo-router';
import { CheckinProvider } from '@/contexts/CheckinContext';

export default function CheckinLayout() {
  return (
    <CheckinProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CheckinProvider>
  );
}

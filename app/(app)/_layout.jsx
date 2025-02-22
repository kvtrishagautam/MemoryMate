import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    }
  }, [user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // If user is authenticated, redirect to home based on role
      const role = user.user_metadata?.role;
      router.replace(role === 'caretaker' ? '/(app)/caretaker/home' : '/(app)/patient/home');
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

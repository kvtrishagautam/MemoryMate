import { Stack, useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if on login page and user is authenticated
    if (user && pathname === '/auth/login') {
      const role = user.user_metadata?.role;
      router.replace(role === 'caretaker' ? '/(app)/caretaker/home' : '/(app)/patient/home');
    }
  }, [user, pathname]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

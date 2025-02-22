import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        router.replace('/auth/login');
        return;
      }

      const user = JSON.parse(userData);
      const isInAuthGroup = segments[0] === 'auth';

      if (user.role === 'patient') {
        router.replace('/(app)/patient/home');
      } else if (user.role === 'caretaker') {
        router.replace('/(app)/caretaker/dashboard');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/auth/login');
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

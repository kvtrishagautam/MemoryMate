import { Stack } from 'expo-router';

export default function CaretakerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Caretaker Dashboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

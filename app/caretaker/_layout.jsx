import { Stack } from 'expo-router';

export default function CaretakerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: 'MemoryMate',
          headerShown: true,
        }}
      />
    </Stack>
  );
}

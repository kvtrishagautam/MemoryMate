import { View } from 'react-native';
import React from 'react';
import { Stack, Redirect } from 'expo-router';
import RoleSelection from './screens/RoleSelection';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <Redirect href="/role-selection" />
    </View>
  );
};

export default App;
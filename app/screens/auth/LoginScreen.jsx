import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import supabase from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // First try patient login
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .single();

      if (patientData) {
        // Store user data in context
        await AsyncStorage.setItem('userData', JSON.stringify({
          id: patientData.id,
          email: patientData.email,
          role: 'patient',
          fullName: patientData.full_name
        }));
        router.push('/(app)/screens/PatientHome');
        return;
      }

      // If not found in patients, try caretaker login
      const { data: caretakerData, error: caretakerError } = await supabase
        .from('caretakers')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .single();

      if (caretakerData) {
        // Store user data in context
        await AsyncStorage.setItem('userData', JSON.stringify({
          id: caretakerData.id,
          email: caretakerData.email,
          role: 'caretaker',
          fullName: caretakerData.full_name
        }));
        router.replace('/(app)/caretaker/dashboard');
        return;
      }

      // If we get here, no user was found
      Alert.alert('Error', 'Invalid email or password');
      
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        value={formData.email}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        value={formData.password}
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/role-selection')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#5DB0F5',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#5DB0F5',
    fontWeight: 'bold',
  },
});

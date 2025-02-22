import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function PatientSignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    userId: '',
    age: '',
    email: '',
    password: '',
    gender: '',
    medicalConditions: '',
    emergencyContact: '',
    emergencyContactNumber: ''
  });
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!formData.fullName || !formData.userId || !formData.age || !formData.email || 
        !formData.password || !formData.gender || !formData.emergencyContact || 
        !formData.emergencyContactNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUp({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      if (data) {
        // Convert medical conditions string to array
        const medicalConditions = formData.medicalConditions
          ? formData.medicalConditions.split(',').map(condition => condition.trim())
          : [];

        const { error: profileError } = await supabase
          .from('patients')
          .insert([
            {
              id: data.user.id,
              full_name: formData.fullName,
              user_id: formData.userId,
              age: parseInt(formData.age),
              email: formData.email,
              gender: formData.gender,
              medical_conditions: medicalConditions,
              emergency_contact: formData.emergencyContact,
              emergency_contact_number: formData.emergencyContactNumber
            },
          ]);

        if (profileError) throw profileError;

        Alert.alert('Success', 'Please check your email for verification!', [
          {
            text: 'OK',
            onPress: () => router.push('/auth/login'),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Patient Sign Up</Text>
      <Text style={styles.subtitle}>Create your patient account</Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        value={formData.fullName}
        placeholder="Full Name"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, userId: text })}
        value={formData.userId}
        placeholder="User ID (for caretaker connection)"
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flex1, { marginRight: 10 }]}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          value={formData.age}
          placeholder="Age"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.flex1]}
          onChangeText={(text) => setFormData({ ...formData, gender: text })}
          value={formData.gender}
          placeholder="Gender"
        />
      </View>

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

      <TextInput
        style={[styles.input, styles.textArea]}
        onChangeText={(text) => setFormData({ ...formData, medicalConditions: text })}
        value={formData.medicalConditions}
        placeholder="Medical Conditions (comma-separated)"
        multiline
        numberOfLines={3}
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
        value={formData.emergencyContact}
        placeholder="Emergency Contact Name"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, emergencyContactNumber: text })}
        value={formData.emergencyContactNumber}
        placeholder="Emergency Contact Number"
        keyboardType="phone-pad"
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Sign Up as Patient</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

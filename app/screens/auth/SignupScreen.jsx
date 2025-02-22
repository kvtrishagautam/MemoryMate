import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    age: '',
    email: '',
    password: '',
    role: '',
    patientId: '' // Only for caretakers
  });
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!formData.name || !formData.userId || !formData.age || !formData.email || !formData.password || !formData.role) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.role === 'caretaker' && !formData.patientId) {
      Alert.alert('Error', 'Please enter the Patient ID you want to connect with');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: formData.role
          }
        }
      });

      if (error) throw error;

      if (data) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: formData.name,
              user_id: formData.userId,
              age: parseInt(formData.age),
              email: formData.email,
              role: formData.role
            },
          ]);

        if (profileError) throw profileError;

        // If caretaker, create relationship with patient
        if (formData.role === 'caretaker') {
          const { data: patientData, error: patientError } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', formData.patientId)
            .eq('role', 'patient')
            .single();

          if (patientError) {
            Alert.alert('Error', 'Patient ID not found');
            return;
          }

          const { error: relationshipError } = await supabase
            .from('patient_caretaker_relationships')
            .insert([
              {
                patient_id: patientData.id,
                caretaker_id: data.user.id,
                status: 'pending'
              },
            ]);

          if (relationshipError) throw relationshipError;
        }

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
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        value={formData.name}
        placeholder="Name"
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flex1, { marginRight: 10 }]}
          onChangeText={(text) => setFormData({ ...formData, userId: text })}
          value={formData.userId}
          placeholder="User ID"
        />
        <TextInput
          style={[styles.input, { width: 80 }]}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          value={formData.age}
          placeholder="Age"
          keyboardType="numeric"
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

      <View style={styles.roleContainer}>
        <Text style={styles.label}>Select Role:</Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === 'patient' && styles.roleButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, role: 'patient' })}
          >
            <Text style={[
              styles.roleButtonText,
              formData.role === 'patient' && styles.roleButtonTextActive,
            ]}>Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === 'caretaker' && styles.roleButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, role: 'caretaker' })}
          >
            <Text style={[
              styles.roleButtonText,
              formData.role === 'caretaker' && styles.roleButtonTextActive,
            ]}>Caretaker</Text>
          </TouchableOpacity>
        </View>
      </View>

      {formData.role === 'caretaker' && (
        <TextInput
          style={styles.input}
          onChangeText={(text) => setFormData({ ...formData, patientId: text })}
          value={formData.patientId}
          placeholder="Patient ID to connect with"
        />
      )}

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginLink}>Login</Text>
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
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  flex1: {
    flex: 1,
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
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#5DB0F5',
    fontWeight: 'bold',
  },
  roleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleButtonText: {
    color: '#333',
    fontSize: 16,
  },
  roleButtonTextActive: {
    color: '#fff',
  },
});

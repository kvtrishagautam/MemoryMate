import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function CaretakerSignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    userId: '',
    age: '',
    email: '',
    password: '',
    specialization: '',
    yearsOfExperience: '',
    certificationDetails: '',
    contactNumber: '',
    patientUserId: '' // To connect with patient
  });
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!formData.fullName || !formData.userId || !formData.age || !formData.email || 
        !formData.password || !formData.specialization || !formData.yearsOfExperience || 
        !formData.contactNumber || !formData.patientUserId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('caretakers')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        Alert.alert('Error', 'Email already registered');
        return;
      }

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Check if the patient exists
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', formData.patientUserId)
        .single();

      if (patientError || !patientData) {
        Alert.alert('Error', 'Patient ID not found. Please verify the Patient ID.');
        return;
      }

      // Create new caretaker profile
      const { data: newCaretaker, error: profileError } = await supabase
        .from('caretakers')
        .insert([
          {
            full_name: formData.fullName,
            user_id: formData.userId,
            age: parseInt(formData.age),
            email: formData.email,
            password: formData.password, // Note: In production, this should be hashed
            specialization: formData.specialization,
            years_of_experience: parseInt(formData.yearsOfExperience),
            certification_details: formData.certificationDetails,
            contact_number: formData.contactNumber,
            role: 'caretaker'
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile Error:', profileError);
        throw new Error('Error creating caretaker profile');
      }

      // Create relationship with patient
      const { error: relationshipError } = await supabase
        .from('patient_caretaker_relationships')
        .insert([
          {
            patient_id: patientData.id,
            caretaker_id: newCaretaker.id,
            status: 'pending'
          }
        ]);

      if (relationshipError) {
        console.error('Relationship Error:', relationshipError);
        throw new Error('Error creating patient-caretaker relationship');
      }

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/auth/login'),
        },
      ]);
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Caretaker Sign Up</Text>
      <Text style={styles.subtitle}>Create your caretaker account</Text>

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
        placeholder="User ID"
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
          onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
          value={formData.contactNumber}
          placeholder="Contact Number"
          keyboardType="phone-pad"
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
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, specialization: text })}
        value={formData.specialization}
        placeholder="Specialization"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, yearsOfExperience: text })}
        value={formData.yearsOfExperience}
        placeholder="Years of Experience"
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        onChangeText={(text) => setFormData({ ...formData, certificationDetails: text })}
        value={formData.certificationDetails}
        placeholder="Certification Details"
        multiline
        numberOfLines={3}
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, patientUserId: text })}
        value={formData.patientUserId}
        placeholder="Patient's User ID to connect with"
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Sign Up as Caretaker</Text>
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

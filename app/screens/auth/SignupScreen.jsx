import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SignupScreen = () => {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    phone: '',
  });

  // Additional fields for caretaker
  const [caretakerFields, setCaretakerFields] = useState({
    specialization: '',
    experience: '',
  });

  const handleSignup = () => {
    // Here we'll add Firebase authentication
    // For now, just navigate to login
    router.push('/auth/login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{role === 'caretaker' ? 'Caretaker Signup' : 'Patient Signup'}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
        />

        {role === 'caretaker' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Specialization"
              value={caretakerFields.specialization}
              onChangeText={(text) => setCaretakerFields({ ...caretakerFields, specialization: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Years of Experience"
              keyboardType="numeric"
              value={caretakerFields.experience}
              onChangeText={(text) => setCaretakerFields({ ...caretakerFields, experience: text })}
            />
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/auth/login')}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 16,
  },
});

export default SignupScreen;

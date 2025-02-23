import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const RoleSelection = () => {
  const router = useRouter();

  const handleRoleSelect = (role) => {
    if (role === 'patient') {
      router.push('/auth/patient-signup');
    } else {
      router.push('/auth/caretaker-signup');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MemoryMate</Text>
      <Text style={styles.subtitle}>Create an Account</Text>
      
      <TouchableOpacity 
        style={[styles.roleCard, styles.patientCard]} 
        onPress={() => handleRoleSelect('patient')}
      >
        <Image 
          source={require('../../assets/images/tasks.png')}
          style={styles.roleImage}
        />
        <Text style={styles.roleText}>I am a Patient</Text>
        <Text style={styles.roleDescription}>
          Sign up to get help with your daily activities
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.roleCard, styles.caretakerCard]} 
        onPress={() => handleRoleSelect('caretaker')}
      >
        <Image 
          source={require('../../assets/images/tasks.png')}
          style={styles.roleImage}
        />
        <Text style={styles.roleText}>I am a Caretaker</Text>
        <Text style={styles.roleDescription}>
          Sign up to help manage patient activities
        </Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  roleCard: {
    padding: 25,
    borderRadius: 15,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  caretakerCard: {
    backgroundColor: '#FFE5E5',
  },
  patientCard: {
    backgroundColor: '#E5F1FF',
  },
  roleImage: {
    width: 70,
    height: 70,
    marginBottom: 15,
  },
  roleText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  roleDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default RoleSelection;

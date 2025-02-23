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
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>Select how you want to use MemoryMate</Text>
      
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
          Create an account to get help with your daily activities
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
          Create an account to help manage patient activities
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  roleCard: {
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  caretakerCard: {
    backgroundColor: '#FFE5E5',
  },
  patientCard: {
    backgroundColor: '#E5F1FF',
  },
  roleImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  roleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default RoleSelection;

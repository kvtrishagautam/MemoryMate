import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const RoleSelection = () => {
  const router = useRouter();

  const handleRoleSelect = (role) => {
    router.push({
      pathname: '/auth/signup',
      params: { role }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please select your role.</Text>
      
      <TouchableOpacity 
        style={[styles.roleCard, styles.caretakerCard]} 
        onPress={() => handleRoleSelect('caretaker')}
      >
        <Image 
          source={require('../../assets/images/tasks.png')}
          style={styles.roleImage}
        />
        <Text style={styles.roleText}>Caretaker</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.roleCard, styles.patientCard]} 
        onPress={() => handleRoleSelect('patient')}
      >
        <Image 
          source={require('../../assets/images/tasks.png')}
          style={styles.roleImage}
        />
        <Text style={styles.roleText}>Patient</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  roleCard: {
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  caretakerCard: {
    backgroundColor: '#FFE5E5',
  },
  patientCard: {
    backgroundColor: '#E5F1FF',
  },
  roleImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  roleText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RoleSelection;

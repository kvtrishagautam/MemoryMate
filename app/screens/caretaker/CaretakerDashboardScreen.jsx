import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const PatientCard = ({ patient, onActionPress }) => {
  const actionButtons = [
    { icon: 'notifications', text: 'Add Reminder', color: '#FF6B6B', action: 'reminders' },
    { icon: 'location', text: 'Track Location', color: '#4ECDC4', action: 'track' },
    { icon: 'stats-chart', text: 'View Status', color: '#45B7D1', action: 'geofence' },
    { icon: 'add-circle', text: 'Add Task', color: '#96CEB4', action: 'tasks' }
  ];

  return (
    <View style={styles.card}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientLabel}>Your Care Patient</Text>
        <Text style={styles.name}>{patient.full_name}</Text>
        <Text style={styles.detail}>Age: {patient.age}</Text>
        {patient.medical_conditions && (
          <Text style={styles.detail}>Medical Conditions: {patient.medical_conditions}</Text>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        {actionButtons.map((button, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.actionButton}
            onPress={() => onActionPress(button.action, patient)}
          >
            <View style={[styles.iconBackground, { backgroundColor: button.color }]}>
              <Ionicons name={button.icon} size={32} color="white" />
            </View>
            <Text style={[styles.actionText, { color: button.color }]}>{button.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const CaretakerDashboardScreen = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caretakerName, setCaretakerName] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        console.log('No user data found');
        router.replace('/auth/login');
        return;
      }

      const userData = JSON.parse(userDataStr);
      console.log('Fetching patients for caretaker:', userData);
      setCaretakerName(userData.fullName); // Set caretaker name from userData

      // First get caretaker details to get the user_id
      const { data: caretakerData, error: caretakerError } = await supabase
        .from('caretakers')
        .select('user_id')
        .eq('id', userData.id)
        .single();

      if (caretakerError) {
        console.error('Error fetching caretaker:', caretakerError);
        throw caretakerError;
      }

      // Get patient IDs from relationships table
      const { data: relationships, error: relError } = await supabase
        .from('patient_caretaker_relationships')
        .select('patient_id')
        .eq('caretaker_id', caretakerData.user_id)
        .eq('status', 'accepted');

      if (relError) {
        console.error('Error fetching relationships:', relError);
        throw relError;
      }

      if (!relationships || relationships.length === 0) {
        console.log('No patient relationships found');
        setPatients([]);
        return;
      }

      // Get patient details from patients table
      const patientIds = relationships.map(rel => rel.patient_id);
      const { data: patientDetails, error: patientError } = await supabase
        .from('patients')
        .select(`
          full_name,
          age,
          medical_conditions
        `)
        .in('user_id', patientIds);

      if (patientError) {
        console.error('Error fetching patient details:', patientError);
        throw patientError;
      }

      const validPatients = patientDetails.map(patient => ({
        full_name: patient.full_name || 'Unknown',
        age: patient.age,
        medical_conditions: patient.medical_conditions
      })).filter(patient => patient.full_name !== 'Unknown');

      console.log('Valid patients:', validPatients);
      setPatients(validPatients);

    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionPress = (action, patient) => {
    switch (action) {
      case 'reminders':
        router.push(`/(app)/caretaker/reminders/${patient.id}`);
        break;
      case 'track':
        router.push(`/(app)/caretaker/track/${patient.id}`);
        break;
      case 'geofence':
        router.push(`/(app)/caretaker/geofence/${patient.id}`);
        break;
      case 'tasks':
        router.push(`/(app)/caretaker/tasks/${patient.id}`);
        break;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading patients...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome </Text>
          <Text style={styles.caretakerName}>{caretakerName}</Text>
        </View>
      </View>

      {patients.map((patient, index) => (
        <PatientCard 
          key={index} 
          patient={patient}
          onActionPress={(action) => handleActionPress(action, patient)}
        />
      ))}
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Current Status: {patients.length > 0 ? 'Active Care' : 'No Patients'}
        </Text>
        <Text style={styles.lastUpdated}>Last updated: Just now</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F7FF',
    paddingTop: 8,
  },
  header: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
      },
      android: {
        elevation: 2
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
      }
    })
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#6B7280',
  },
  caretakerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
      },
      android: {
        elevation: 5
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
      }
    })
  },
  patientInfo: {
    marginBottom: 24,
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
  },
  patientLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '500',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    width: '45%',
    marginVertical: 12,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)'
      },
      android: {
        elevation: 3
      },
      web: {
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)'
      }
    })
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
  },
});

export default CaretakerDashboardScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const PatientCard = ({ patient, onActionPress }) => {
  const actionButtons = [
    {
      icon: 'alarm-outline',
      label: 'Add Reminders',
      action: 'reminders',
      color: '#FF6B6B' // Vibrant coral red
    },
    {
      icon: 'stats-chart-outline',
      label: 'View Status',
      action: 'status',
      color: '#4ECDC4' // Turquoise
    },
    {
      icon: 'location-outline',
      label: 'Track Location',
      action: 'location',
      color: '#45B7D1' // Sky blue
    },
    {
      icon: 'list-outline',
      label: 'Add Tasks',
      action: 'tasks',
      color: '#96CEB4' // Soft green
    }
  ];

  return (
    <View style={styles.card}>
      <View style={styles.patientInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Patient Name:</Text>
          <Text style={styles.infoValue}>{patient.full_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{patient.age} years</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Caretaker:</Text>
          <Text style={styles.infoValue}>{patient.caretaker_name}</Text>
        </View>
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButtonsRow}>
          {actionButtons.slice(0, 2).map((button) => (
            <TouchableOpacity
              key={button.action}
              style={styles.actionButton}
              onPress={() => onActionPress(button.action, patient)}
            >
              <View style={[styles.iconContainer]}>
                <Ionicons name={button.icon} size={40} color={button.color} />
                <Text style={[styles.actionLabel, { color: button.color }]}>{button.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.actionButtonsRow}>
          {actionButtons.slice(2, 4).map((button) => (
            <TouchableOpacity
              key={button.action}
              style={styles.actionButton}
              onPress={() => onActionPress(button.action, patient)}
            >
              <View style={[styles.iconContainer]}>
                <Ionicons name={button.icon} size={40} color={button.color} />
                <Text style={[styles.actionLabel, { color: button.color }]}>{button.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const CaretakerDashboardScreen = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caretakerName, setCaretakerName] = useState('');
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
          }
        }
      ]
    );
  };

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

      // First get caretaker details to get user_id
      const { data: caretakerData, error: caretakerError } = await supabase
        .from('caretakers')
        .select('*')
        .eq('id', userData.id)
        .single();

      if (caretakerError) {
        console.error('Error fetching caretaker:', caretakerError);
        throw caretakerError;
      }

      setCaretakerName(caretakerData.full_name || 'Caretaker');

      // Get patient relationships using caretaker's user_id
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
        setPatients([]);
        setLoading(false);
        return;
      }

      // Get patient details using the patient_ids as user_ids
      const patientIds = relationships.map(rel => rel.patient_id);
      const { data: patientDetails, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .in('user_id', patientIds);

      if (patientError) {
        console.error('Error fetching patient details:', patientError);
        throw patientError;
      }

      const validPatients = patientDetails.map(patient => ({
        id: patient.id,
        full_name: patient.full_name,
        age: patient.age,
        caretaker_name: caretakerName
      }));

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
        router.push(`/caretaker/reminders/${patient.id}`);
        break;
      case 'status':
        router.push(`/caretaker/status/${patient.id}`);
        break;
      case 'location':
        router.push(`/caretaker/location/${patient.id}`);
        break;
      case 'tasks':
        router.push(`/caretaker/tasks/${patient.id}`);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Patients</Text>
        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.patientList}>
        {loading ? (
          <Text style={styles.messageText}>Loading patients...</Text>
        ) : patients.length === 0 ? (
          <Text style={styles.messageText}>No patients found</Text>
        ) : (
          patients.map((patient) => (
            <PatientCard 
              key={patient.id} 
              patient={patient}
              onActionPress={(action) => handleActionPress(action, patient)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  signOutButton: {
    padding: 8,
  },
  patientList: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  patientInfo: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  actionButton: {
    width: '48%',
  },
  iconContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8,
  },
  actionLabel: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
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

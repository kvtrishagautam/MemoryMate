import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

const CaretakerDashboardScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [caretakerDetails, setCaretakerDetails] = useState(null);
  const [patients, setPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    loadCaretakerData();
  }, []);

  useEffect(() => {
    if (caretakerDetails?.id) {
      fetchPatients();
      fetchPendingRequests();
    }
  }, [caretakerDetails]);

  const loadCaretakerData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        router.replace('/auth/login');
        return;
      }

      const userData = JSON.parse(userDataStr);
      if (userData.role !== 'caretaker') {
        Alert.alert('Error', 'Only caretakers can access this screen');
        router.back();
        return;
      }

      // Get caretaker details
      const { data: caretakerData, error: caretakerError } = await supabase
        .from('caretakers')
        .select('*')
        .eq('id', userData.id)
        .single();

      if (caretakerError) throw caretakerError;
      setCaretakerDetails(caretakerData);
    } catch (error) {
      console.error('Error loading caretaker data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    }
  };

  async function fetchPatients() {
    if (!caretakerDetails?.id) return;
    
    try {
      const { data: relationships, error } = await supabase
        .from('patient_caretaker_relationships')
        .select(`
          patient:patients (
            user_id,
            full_name,
            emergency_contact_number,
            medical_conditions
          )
        `)
        .eq('caretaker_id', parseInt(caretakerDetails.id))
        .eq('status', 'accepted');

      if (error) throw error;

      if (relationships) {
        const validPatients = relationships
          .map(rel => rel.patient)
          .filter(patient => patient !== null);
        setPatients(validPatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }

  async function fetchPendingRequests() {
    if (!caretakerDetails?.id) return;

    try {
      const { data: requests, error } = await supabase
        .from('patient_caretaker_relationships')
        .select(`
          id,
          patient:patients (
            user_id,
            full_name,
            emergency_contact_number
          ),
          status
        `)
        .eq('caretaker_id', parseInt(caretakerDetails.id))
        .in('status', ['pending', 'rejected']);

      if (error) throw error;

      if (requests) {
        setPendingRequests(requests);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePatientPress = (patient) => {
    // Navigate to patient details (to be implemented)
    Alert.alert('View Patient', `Viewing details for ${patient.full_name}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => handlePatientPress(item)}
    >
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.full_name}</Text>
        <Text style={styles.patientDetails}>Age: {item.age}</Text>
        <Text style={styles.patientDetails}>Gender: {item.gender}</Text>
        <Text style={styles.medicalConditions}>
          Conditions: {item.medical_conditions?.join(', ') || 'None listed'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{caretakerDetails?.full_name}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Add Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Schedule Visit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Requests</Text>
        {pendingRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <Text style={styles.patientName}>{request.patient.full_name}</Text>
            <Text>Contact: {request.patient.emergency_contact_number}</Text>
            <Text style={[
              styles.statusText,
              request.status === 'pending' ? styles.pendingStatus : styles.rejectedStatus
            ]}>
              Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Patients</Text>
        {patients.map((patient) => (
          <View key={patient.user_id} style={styles.patientCard}>
            <Text style={styles.patientName}>{patient.full_name}</Text>
            <Text>Contact: {patient.emergency_contact_number}</Text>
            {patient.medical_conditions && patient.medical_conditions.length > 0 && (
              <Text style={styles.medicalHistory}>
                Medical Conditions: {patient.medical_conditions.join(', ')}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    padding: 10,
  },
  signOutText: {
    color: '#ff4444',
    fontSize: 16,
  },
  quickActions: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '48%',
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  section: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  patientList: {
    paddingBottom: 20,
  },
  patientCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  patientDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  medicalConditions: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  requestCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  statusText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  pendingStatus: {
    color: '#FFA000',
  },
  rejectedStatus: {
    color: '#f44336',
  },
  medicalHistory: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default CaretakerDashboardScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import permissionChecks from '../../utils/permissionChecks';
import dataAccess from '../../utils/dataAccess';

const { isCaretaker } = permissionChecks;
const { getAssignedPatients, getCaretakerDetails } = dataAccess;

const CaretakerDashboardScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [caretakerDetails, setCaretakerDetails] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    checkRoleAndLoadData();
  }, []);

  const checkRoleAndLoadData = async () => {
    try {
      const isCaretakerUser = await isCaretaker();
      if (!isCaretakerUser) {
        Alert.alert('Error', 'Only caretakers can access this screen');
        router.back();
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/auth/login');
        return;
      }

      await loadCaretakerData(user.id);
    } catch (error) {
      console.error('Error in checkRoleAndLoadData:', error);
      Alert.alert('Error', 'Failed to load caretaker dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadCaretakerData = async (caretakerId) => {
    try {
      const [caretakerData, assignedPatients] = await Promise.all([
        getCaretakerDetails(caretakerId),
        getAssignedPatients(caretakerId),
      ]);

      setCaretakerDetails(caretakerData);
      setPatients(assignedPatients || []);
    } catch (error) {
      console.error('Error loading caretaker data:', error);
      Alert.alert('Error', 'Failed to load patient data');
    }
  };

  const handlePatientPress = (patientId) => {
    router.push(`/patient/details/${patientId}`);
  };

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => handlePatientPress(item.patient_id)}
    >
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.profiles.full_name}</Text>
        <Text style={styles.patientDetails}>Patient ID: {item.patient_id}</Text>
        <Text style={styles.patientDetails}>Age: {item.age}</Text>
        <Text style={styles.patientDetails}>Phone: {item.phone}</Text>
      </View>
      <View style={styles.actionButton}>
        <Text style={styles.actionButtonText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Caretaker Dashboard</Text>
        <View style={styles.caretakerInfo}>
          <Text style={styles.caretakerName}>
            {caretakerDetails?.profiles?.full_name}
          </Text>
          <Text style={styles.caretakerDetails}>
            Specialization: {caretakerDetails?.specialization}
          </Text>
          <Text style={styles.caretakerDetails}>
            Experience: {caretakerDetails?.experience} years
          </Text>
        </View>
      </View>

      <View style={styles.patientsSection}>
        <Text style={styles.sectionTitle}>Your Patients</Text>
        {patients.length === 0 ? (
          <View style={styles.noPatients}>
            <Text style={styles.noPatientsText}>
              You haven't been assigned any patients yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={patients}
            renderItem={renderPatientCard}
            keyExtractor={(item) => item.patient_id.toString()}
            contentContainerStyle={styles.patientsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  caretakerInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  caretakerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  caretakerDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  patientsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#007AFF',
  },
  patientsList: {
    paddingBottom: 16,
  },
  patientCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noPatients: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPatientsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CaretakerDashboardScreen;

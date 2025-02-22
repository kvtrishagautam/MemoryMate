import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

const ActionButton = ({ icon, title, onPress, color }) => (
  <TouchableOpacity 
    style={[styles.actionButton, { backgroundColor: color }]} 
    onPress={onPress}
  >
    <Ionicons name={icon} size={24} color="white" />
    <Text style={styles.actionButtonText}>{title}</Text>
  </TouchableOpacity>
);

const PatientCard = ({ patient }) => {
  const router = useRouter();

  return (
    <View style={styles.patientCard}>
      <View style={styles.patientInfo}>
        <Image 
          source={{ uri: patient.avatar_url || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientAge}>Age: {patient.age}</Text>
          <Text style={styles.patientCondition}>{patient.condition}</Text>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <ActionButton 
          icon="notifications-outline" 
          title="Reminders" 
          color="#4ECDC4"
          onPress={() => router.push('/reminders')}
        />
        <ActionButton 
          icon="location-outline" 
          title="Track" 
          color="#FF6B6B"
          onPress={() => router.push('/location')}
        />
        <ActionButton 
          icon="map-outline" 
          title="Geofence" 
          color="#45B7D1"
          onPress={() => router.push('/geofence')}
        />
        <ActionButton 
          icon="create-outline" 
          title="Tasks" 
          color="#96CEB4"
          onPress={() => router.push('/tasks')}
        />
      </View>
    </View>
  );
};

const CaretakerDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name');

      if (error) throw error;

      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Caretaker Dashboard</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#4ECDC4" />
          <Text style={styles.addButtonText}>Add Patient</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    marginLeft: 4,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  patientDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  patientAge: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 4,
  },
  patientCondition: {
    fontSize: 16,
    color: '#6C757D',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexBasis: '48%',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default CaretakerDashboard;

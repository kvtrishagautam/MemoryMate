import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PatientCard = ({ patient }) => {
  const actionButtons = [
    { icon: 'notifications', text: 'Reminders', color: '#FF6B6B' },
    { icon: 'location', text: 'Track', color: '#4ECDC4' },
    { icon: 'map', text: 'Geofence', color: '#45B7D1' },
    { icon: 'list', text: 'Tasks', color: '#96CEB4' }
  ];

  return (
    <View style={styles.card}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientLabel}>Your Care Patient</Text>
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.detail}>Age: {patient.age}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        {actionButtons.map((button, index) => (
          <TouchableOpacity key={index} style={styles.actionButton}>
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

const CaretakerDashboard = () => {
  // Sample patient data - in real app this would come from Supabase
  const patient = {
    id: '1',
    name: 'John Smith',
    age: 72,
  };

  return (
    <View style={styles.container}>
      <PatientCard patient={patient} />
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Current Status: Active Care</Text>
        <Text style={styles.lastUpdated}>Last updated: 5 minutes ago</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F7FF',
    paddingTop: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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

export default CaretakerDashboard;

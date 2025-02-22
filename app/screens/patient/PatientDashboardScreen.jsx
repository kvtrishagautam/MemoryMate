import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function PatientDashboardScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [caretakers, setCaretakers] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData?.id) {
      fetchCaretakers();
    }
  }, [userData]);

  async function loadUserData() {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async function fetchCaretakers() {
    if (!userData?.id) return;
    
    try {
      const { data: relationships, error } = await supabase
        .from('patient_caretaker_relationships')
        .select(`
          caretaker:caretakers (
            id,
            full_name,
            specialization,
            contact_number
          )
        `)
        .eq('patient_id', userData.id)
        .eq('status', 'accepted');

      if (error) throw error;

      if (relationships) {
        const validCaretakers = relationships
          .map(rel => rel.caretaker)
          .filter(caretaker => caretaker !== null);
        setCaretakers(validCaretakers);
      }
    } catch (error) {
      console.error('Error fetching caretakers:', error);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{userData?.fullName}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Medical Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Schedule Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Emergency Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Caretakers Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Caretakers</Text>
        {caretakers.length > 0 ? (
          caretakers.map((caretaker) => (
            <View key={caretaker.id} style={styles.caretakerCard}>
              <Text style={styles.caretakerName}>{caretaker.full_name}</Text>
              <Text style={styles.caretakerDetails}>
                {caretaker.specialization}
              </Text>
              <Text style={styles.caretakerContact}>
                {caretaker.contact_number}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No caretakers assigned yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  caretakerCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  caretakerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  caretakerDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  caretakerContact: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

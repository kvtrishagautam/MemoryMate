import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Image source={icon} style={styles.menuIcon} resizeMode="contain" />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const PatientHome = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: 'Loading...',
    age: '',
    caretakerName: '',
    username: ''
  });

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        console.error('No user data found');
        return;
      }

      const userData = JSON.parse(userDataStr);

      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('email', userData.email)
        .single();

      if (patientError) {
        console.error('Error fetching patient:', patientError);
        return;
      }

      const { data: relationships, error: caretakerError } = await supabase
        .from('patient_caretaker_relationships')
        .select(`
          caretaker:caretakers (
            full_name
          )
        `)
        .eq('patient_id', patient.id)
        .eq('status', 'accepted')
        .single();

      setUserInfo({
        name: patient.full_name || 'Patient',
        age: patient.age || '',
        caretakerName: relationships?.caretaker?.full_name || 'Not assigned',
        username: patient.email?.split('@')[0] || ''
      });

    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MemoryMate</Text>
        <TouchableOpacity onPress={() => router.push('/screens/SettingsScreen')}>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://placekitten.com/100/100' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Hi, {userInfo.name}</Text>
            <Text style={styles.profileDetails}>Age: {userInfo.age}</Text>
            <Text style={styles.profileDetails}>Caretaker's Name: {userInfo.caretakerName}</Text>
            <Text style={styles.profileDetails}>Username: {userInfo.username}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.emergencyButton}>
          <Ionicons name="call" size={24} color="white" />
          <Text style={styles.emergencyText}>Emergency</Text>
        </TouchableOpacity>

        <View style={styles.menuGrid}>
          <MenuItem
            icon={require('../../../assets/icons/taskicon1.png')}
            label="Daily tasks"
            onPress={() => {}}
          />
          <MenuItem
            icon={require('../../../assets/icons/activityicon.png')}
            label="Activities"
            onPress={() => {}}
          />
          <MenuItem
            icon={require('../../../assets/icons/gameicon.png')}
            label="Games"
            onPress={() => router.push('/screens/GamePage')}
          />
          <MenuItem
            icon={require('../../../assets/icons/famtree.png')}
            label="Family Tree"
            onPress={() => {}}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="location-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 14,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    marginTop: 50,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#E5F1FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: '10%',
  },
  greeting: {
    fontSize: 24,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  emergencyButton: {
    backgroundColor: '#FF6B6B',
    margin: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  menuItem: {
    width: '45%',
    height: 153,
    backgroundColor: '#F7F6EE',
    borderRadius: 15,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  menuLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 41,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    position: 'absolute',
    bottom: 25,
    left: 8,
    right: 8,
    marginHorizontal: 8,
  },
  navItem: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default PatientHome;

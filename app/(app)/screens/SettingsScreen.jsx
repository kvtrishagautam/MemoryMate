import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Loading...',
    email: '',
    profileImage: 'https://placekitten.com/200/200'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        console.error('No user data found');
        return;
      }

      const userData = JSON.parse(userDataStr);

      // Fetch patient data if user is a patient
      if (userData.role === 'patient') {
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('email', userData.email)
          .single();

        if (patientError) {
          console.error('Error fetching patient:', patientError);
          return;
        }

        setUserInfo({
          name: patient.full_name || 'Patient',
          email: patient.email,
          profileImage: patient.profile_image || userInfo.profileImage
        });
      } 
      // Fetch caretaker data if user is a caretaker
      else if (userData.role === 'caretaker') {
        const { data: caretaker, error: caretakerError } = await supabase
          .from('caretakers')
          .select('*')
          .eq('email', userData.email)
          .single();

        if (caretakerError) {
          console.error('Error fetching caretaker:', caretakerError);
          return;
        }

        setUserInfo({
          name: caretaker.full_name || 'Caretaker',
          email: caretaker.email,
          profileImage: caretaker.profile_image || userInfo.profileImage
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userInfo.name) + '&background=007AFF&color=fff';

  const handleBack = () => {
    router.replace('/screens/PatientHome');
  };

  const handleLogoutConfirm = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setShowLogoutModal(false);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleAboutPress = () => {
    router.push('/screens/AboutScreen');
  };

  const handleHelpPress = () => {
    router.push('/(app)/screens/HelpSupportScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.container}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: imageError ? defaultAvatar : userInfo.profileImage }}
            style={styles.profileImage}
            onError={() => setImageError(true)}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userInfo.name}</Text>
            <Text style={styles.profileEmail}>{userInfo.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={22} color="#007AFF" />
            </View>
            <Text style={styles.optionText}>Account</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications-outline" size={22} color="#007AFF" />
            </View>
            <Text style={styles.optionText}>Notifications</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="eye-outline" size={22} color="#007AFF" />
            </View>
            <Text style={styles.optionText}>Appearance</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#007AFF" />
            </View>
            <Text style={styles.optionText}>Privacy & Security</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionContainer}
          onPress={handleHelpPress}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="headset-outline" size={22} color="#007AFF" />
            </View>
            <Text style={styles.optionText}>Help and Support</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionContainer}
          onPress={handleAboutPress}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle-outline" size={22} color="#007AFF" />
            </View>
            <Text style={styles.optionText}>About</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionContainer, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            </View>
            <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>All rights reserved | Team accessDenied</Text>
        </View>

        <Modal
          visible={showLogoutModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelLogout}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Logout</Text>
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelLogout}
                >
                  <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleLogoutConfirm}
                >
                  <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#007AFF',
    fontSize: 17,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 70,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  optionContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 17,
    color: '#000',
  },
  logoutButton: {
    marginTop: 16,
  },
  logoutText: {
    color: '#FF3B30',
  },
  copyrightContainer: {
    padding: 16,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  modalButtonText: {
    fontSize: 17,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#000',
  },
  confirmButtonText: {
    color: '#fff',
  },
});

export default SettingsScreen;

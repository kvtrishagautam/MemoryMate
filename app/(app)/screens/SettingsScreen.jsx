import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const userInfo = {
    name: 'Angga Risky',
    email: 'angga@example.com',
    profileImage: 'https://placekitten.com/200/200'
  };

  const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userInfo.name) + '&background=007AFF&color=fff';

  const handleBack = () => {
    router.replace('/screens/PatientHome');
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    router.replace('/auth/login');
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
              <View style={styles.modalHeader}>
                <Ionicons name="log-out-outline" size={32} color="#FF3B30" />
                <Text style={styles.modalTitle}>Logout</Text>
              </View>
              <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={handleCancelLogout}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleLogoutConfirm}
                >
                  <Text style={styles.confirmButtonText}>Logout</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingBottom: 30,
    width: '100%',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    marginBottom: 12,
  },
  profileInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
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
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#000',
  },
  logoutButton: {
    marginTop: 40,
  },
  logoutText: {
    color: '#FF3B30',
  },
  copyrightContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
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
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SettingsScreen;

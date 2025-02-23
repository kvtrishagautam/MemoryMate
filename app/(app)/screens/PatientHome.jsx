import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Image source={icon} style={styles.menuIcon} resizeMode="contain" />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const PatientHome = () => {
  const router = useRouter();
  
  const navigateToTask = () => {
    router.push('/(app)/task');
  };

  const userInfo = {
    name: 'Elsa',
    age: 30,
    caretakerName: 'Liam',
    username: 'Elsa003'
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MemoryMate</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
              icon={require('../../../assets/images/tasks.png')}
              label="Daily tasks"
              onPress={navigateToTask}
            />
            <MenuItem
              icon={require('../../../assets/images/tasks.png')}
              label="Activities"
              onPress={() => {}}
            />
            <MenuItem
              icon={require('../../../assets/images/tasks.png')}
              label="Games"
              onPress={() => router.push('/screens/GamePage')}
            />
            <MenuItem
              icon={require('../../../assets/images/tasks.png')}
              label="Family Tree"
              onPress={() => {}}
            />
          </View>
        </ScrollView>

        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="notifications-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/(app)/location')}
          >
            <Ionicons name="location-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for bottom navigation
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
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
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileDetails: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  emergencyButton: {
    backgroundColor: '#FF6B6B',
    margin: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#F7F6EE',
    borderRadius: 15,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 2,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  navItem: {
    padding: 12,
  },
});

export default PatientHome;
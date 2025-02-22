import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Image source={icon} style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const PatientHome = () => {
  const router = useRouter();
  
  const userInfo = {
    name: 'Elsa',
    age: 30,
    caretakerName: 'Liam',
    username: 'Elsa003'
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MemoryMate</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

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
          onPress={() => {}}
        />
        <MenuItem
          icon={require('../../../assets/images/tasks.png')}
          label="Activities"
          onPress={() => {}}
        />
        <MenuItem
          icon={require('../../../assets/images/tasks.png')}
          label="Games"
          onPress={() => {}}
        />
        <MenuItem
          icon={require('../../../assets/images/tasks.png')}
          label="Family Tree"
          onPress={() => {}}
        />
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/notification')}
        >
          <Ionicons name="notifications-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="location-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  },
  headerTitle: {
    fontSize: 20,
    color: '#666',
  },
  profileCard: {
    backgroundColor: '#E5F1FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileDetails: {
    color: '#666',
    fontSize: 14,
  },
  emergencyButton: {
    backgroundColor: '#FF6B6B',
    margin: 16,
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
  },
  menuItem: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    padding: 8,
  },
});

export default PatientHome;

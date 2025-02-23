import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const GameCard = ({ title, description, onPress }) => (
  <TouchableOpacity style={styles.gameCard} onPress={onPress}>
    <View style={styles.imageSection}>
      <Image 
        source={require('../../../assets/gameimg/game1.png')}
        style={styles.gameImage}
        resizeMode="cover"
      />
    </View>
    <View style={styles.textSection}>
      <Text style={styles.gameTitle}>{title}</Text>
      <Text style={styles.gameDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

const GamePage = () => {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MemoryMate</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Games:</Text>
        <GameCard 
          title="Memory Pair game"
          description="A simple matching pairs game where players flip over cards to find matching pairs"
          onPress={() => router.push('/screens/MemoryCardGame')}
        />
        <GameCard 
          title="Memory Pair game"
          description="A simple matching pairs game where players flip over cards to find matching pairs"
          onPress={() => router.push('/screens/MemoryCardGame')}
        />
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/screens/PatientHome')}>
          <Ionicons name="home-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="location-outline" size={24} color="#666" />
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  gameCard: {
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageSection: {
    height: '70%',
    backgroundColor: '#ff4757',
    width: '100%',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  textSection: {
    height: '40%',
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 20,
    marginTop: '-8%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 12,
    color: '#666',
    paddingBottom: 10,
    marginBottom: 8,
  },
  navbar: {
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

export default GamePage;

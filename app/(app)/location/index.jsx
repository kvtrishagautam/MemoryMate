import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { supabase } from '../../../lib/supabase';
import WebMap from './WebMap';

const LocationScreen = () => {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [homeLocation, setHomeLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        // Get current location with high accuracy
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          maximumAge: 1000
        });
        setLocation(currentLocation);

        // Get home location from database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData, error } = await supabase
            .from('patients')
            .select('home_location')
            .eq('user_id', user.id)
            .single();

          if (!error && userData?.home_location) {
            setHomeLocation(userData.home_location);
          }
        }
      } catch (error) {
        setErrorMsg('Error fetching location');
        console.error(error);
      }
    })();
  }, []);

  const getDirectionsToHome = () => {
    if (!location || !homeLocation) {
      Alert.alert('Error', 'Unable to get directions at this time');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.coords.latitude},${location.coords.longitude}&destination=${homeLocation.latitude},${homeLocation.longitude}&travelmode=walking`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Location</Text>
        <View style={{ width: 24 }} />
      </View>

      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <>
          <View style={styles.mapContainer}>
            <WebMap location={location} homeLocation={homeLocation} />
          </View>

          {homeLocation && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.directionsButton]}
                onPress={getDirectionsToHome}
              >
                <Ionicons name="navigate" size={24} color="white" />
                <Text style={styles.buttonText}>Get Directions Home</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  directionsButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LocationScreen;

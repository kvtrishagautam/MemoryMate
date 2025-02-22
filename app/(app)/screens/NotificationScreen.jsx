import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity,
  Vibration,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { supabase } from '../../../lib/supabase';

const NotificationCard = ({ item, onPress }) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    animatePress();
    Vibration.vibrate(50);
    Speech.speak(item.message + '. ' + item.details, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
    onPress();
  };

  return (
    <Animated.View style={[
      styles.notificationItem,
      { transform: [{ scale: scaleValue }] }
    ]}>
      <TouchableOpacity 
        style={[styles.notificationContent, { backgroundColor: item.color + '15' }]}
        onPress={handlePress}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={32} color="white" />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.timeText}>{item.time}</Text>
          <Text style={styles.notificationType}>{item.type}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.detailsText}>{item.details}</Text>
        </View>
        <TouchableOpacity 
          style={styles.speakerButton}
          onPress={() => Speech.speak(item.message + '. ' + item.details)}
        >
          <Ionicons name="volume-high" size={24} color={item.color} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Initializing Supabase connection...');
    // Test Supabase connection
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('notifications').select('count');
        console.log('Connection test result:', { data, error });
        
        if (error) {
          console.error('Supabase connection test failed:', error.message);
          setError('Database connection failed. Please check your internet connection.');
        } else {
          console.log('Supabase connection successful, fetching notifications...');
          await fetchNotifications();
        }
      } catch (error) {
        console.error('Connection test error:', error);
        setError('Failed to connect to the database');
      }
    };

    testConnection();
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log('Starting to fetch notifications...');
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetch result:', { data, supabaseError });

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        // If no data, use default notifications
        const defaultNotifications = [
          { 
            id: '1', 
            type: 'Medicine', 
            message: 'Take Blood Pressure Medicine',
            scheduled_time: new Date().toISOString(),
            priority: 'high',
            details: '2 tablets with water'
          },
          { 
            id: '2', 
            type: 'Exercise', 
            message: 'Time for Morning Walk',
            scheduled_time: new Date().toISOString(),
            priority: 'medium',
            details: '15 minutes in garden'
          }
        ];
        setNotifications(defaultNotifications.map(notification => ({
          ...notification,
          time: new Date(notification.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: getIconForType(notification.type),
          color: getColorForType(notification.type),
        })));
        return;
      }

      // Transform the data to match our notification format
      const formattedData = data.map(notification => ({
        id: notification.id.toString(),
        type: notification.type || 'default',
        message: notification.message,
        time: new Date(notification.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: getIconForType(notification.type),
        color: getColorForType(notification.type),
        priority: notification.priority,
        details: notification.details
      }));

      setNotifications(formattedData);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type) => {
    const icons = {
      'Medicine': 'medical',
      'Exercise': 'walk',
      'Activity': 'game-controller',
      'Social': 'videocam',
      'default': 'notifications'
    };
    return icons[type] || icons.default;
  };

  const getColorForType = (type) => {
    const colors = {
      'Medicine': '#FF6B6B',
      'Exercise': '#4ECDC4',
      'Activity': '#45B7D1',
      'Social': '#96CEB4',
      'default': '#6C757D'
    };
    return colors[type] || colors.default;
  };

  const handleNotificationPress = (item) => {
    // Handle notification press
    console.log('Pressed:', item.message);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No notifications found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard 
            item={item} 
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    padding: 20,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 6,
  },
  listContainer: {
    padding: 12,
  },
  notificationItem: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  notificationType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 2,
  },
  detailsText: {
    fontSize: 14,
    color: '#6C757D',
  },
  speakerButton: {
    padding: 8,
  },
});

export default NotificationScreen;

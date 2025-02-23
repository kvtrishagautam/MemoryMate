import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.mainTitle}>About MemoryMate</Text>
          <Text style={styles.paragraph}>
            MemoryMate is an open-source mobile application designed to support Alzheimer's patients and their caregivers in managing daily life with ease and confidence. Our mission is to enhance cognitive well-being, promote independence, and strengthen emotional connections through simple yet powerful tools.
          </Text>

          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.paragraph}>
            We believe that technology should empower, not overwhelm. MemoryMate is built with a user-friendly interface and privacy-focused features to ensure that patients and caregivers can navigate their daily lives with peace of mind.
          </Text>

          <Text style={styles.sectionTitle}>What We Offer</Text>
          
          <Text style={styles.subTitle}>For Patients:</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Daily Reminders: Never miss medications, meals, or appointments.</Text>
            <Text style={styles.bulletPoint}>• Memory Games: Engage in fun cognitive exercises.</Text>
            <Text style={styles.bulletPoint}>• Voice Mails: Stay connected with loved ones through recorded messages.</Text>
            <Text style={styles.bulletPoint}>• Emergency Contacts: Quick access to emergency contacts at the tap of a button.</Text>
            <Text style={styles.bulletPoint}>• Photo Recognition: AI-powered identification of family members and objects.</Text>
            <Text style={styles.bulletPoint}>• Location Tracking: Optional feature to share real-time location with caregivers.</Text>
            <Text style={styles.bulletPoint}>• Offline Mode: Access essential features without an internet connection.</Text>
          </View>

          <Text style={styles.subTitle}>For Caregivers:</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Caregiver Dashboard: Manage reminders, track location, and monitor activity logs.</Text>
            <Text style={styles.bulletPoint}>• Voice Mail Recording: Send encouraging messages to patients.</Text>
            <Text style={styles.bulletPoint}>• Medication Tracker: Keep track of medication schedules.</Text>
            <Text style={styles.bulletPoint}>• Safe Zones: Set geofenced areas and receive alerts if a patient wanders.</Text>
          </View>

          <Text style={styles.sectionTitle}>Why MemoryMate?</Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Privacy-Focused: Your data stays secure and under your control.</Text>
            <Text style={styles.bulletPoint}>• Easy to Use: Simple interface designed for seniors and caregivers.</Text>
            <Text style={styles.bulletPoint}>• Open Source: Community-driven development for continuous improvement.</Text>
            <Text style={styles.bulletPoint}>• Compassion-Driven: Built with love to support those affected by Alzheimer's.</Text>
          </View>

          <Text style={styles.closingText}>
            Join us in making daily life easier for Alzheimer's patients and caregivers. MemoryMate is more than an app; it's a helping hand when you need it the most.
          </Text>
        </View>
      </ScrollView>
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
    width: 40,
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 24,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoints: {
    marginLeft: 8,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
  closingText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginTop: 24,
    fontStyle: 'italic',
  },
});

export default AboutScreen;

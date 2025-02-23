import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const HelpSupportScreen = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:memorymate@gmail.com');
  };

  const faqs = [
    {
      id: 1,
      question: 'How do I set up reminders?',
      icon: 'notifications-outline'
    },
    {
      id: 2,
      question: 'How can I send a voice mail to my loved one?',
      icon: 'mail-outline'
    },
    {
      id: 3,
      question: 'Is location tracking mandatory?',
      icon: 'location-outline'
    },
    {
      id: 4,
      question: 'What should I do if the app isn\'t syncing?',
      icon: 'sync-outline'
    },
    {
      id: 5,
      question: 'Can I use the app offline?',
      icon: 'wifi-outline'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.introText}>
            We're here to help! If you have any questions or need support with MemoryMate, please check out the resources below:
          </Text>

          <Text style={styles.sectionTitle}>Frequently Asked Questions (FAQs)</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq) => (
              <TouchableOpacity key={faq.id} style={styles.faqItem}>
                <View style={styles.faqIcon}>
                  <Ionicons name={faq.icon} size={24} color="#007AFF" />
                </View>
                <Text style={styles.faqText}>{faq.question}</Text>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.faqNote}>
            Visit our FAQ section in the app for detailed answers.
          </Text>

          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity onPress={handleEmailPress} style={styles.contactContainer}>
            <View style={styles.contactContent}>
              <Ionicons name="mail-outline" size={24} color="#007AFF" />
              <Text style={styles.emailText}>memorymate@gmail.com</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.responseTime}>
            We aim to respond within 24-48 hours.
          </Text>

          <Text style={styles.sectionTitle}>Community & Feedback</Text>
          <View style={styles.communityContainer}>
            <Text style={styles.communityText}>
              MemoryMate is an open-source project, and we value your feedback! If you have feature suggestions or want to contribute, join our community on GitHub.
            </Text>
            <TouchableOpacity style={styles.githubButton}>
              <Ionicons name="logo-github" size={24} color="#007AFF" />
              <Text style={styles.githubText}>Visit our GitHub</Text>
            </TouchableOpacity>
          </View>
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
  },
  introText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    marginTop: 24,
  },
  faqContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  faqIcon: {
    marginRight: 12,
  },
  faqText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  faqNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  contactContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 12,
  },
  responseTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  communityContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  communityText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  githubText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
});

export default HelpSupportScreen;

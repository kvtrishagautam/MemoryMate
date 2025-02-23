import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import permissionChecks from '../../utils/permissionChecks';
import dataAccess from '../../utils/dataAccess';

const { hasPatientAccess, isCaretaker } = permissionChecks;
const {
  getPatientDetails,
  updatePatientDetails,
  updateMedicalHistory,
  updateMedications,
  updateEmergencyContact,
} = dataAccess;

const PatientDetailsScreen = () => {
  const router = useRouter();
  const { patientId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCaretakerUser, setIsCaretakerUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState({
    full_name: '',
    age: '',
    phone: '',
    medical_history: '',
    medications: [],
    emergency_contact: '',
  });
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    checkAccessAndLoadData();
  }, [patientId]);

  const checkAccessAndLoadData = async () => {
    try {
      const [access, caretaker] = await Promise.all([
        hasPatientAccess(patientId),
        isCaretaker(),
      ]);

      setHasAccess(access);
      setIsCaretakerUser(caretaker);

      if (access) {
        const data = await getPatientDetails(patientId);
        setPatientData(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load patient details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update different aspects of patient data
      if (editedData.medical_history) {
        await updateMedicalHistory(patientId, editedData.medical_history);
      }
      
      if (editedData.medications) {
        await updateMedications(patientId, editedData.medications.split(',').map(med => med.trim()));
      }
      
      if (editedData.emergency_contact) {
        await updateEmergencyContact(patientId, editedData.emergency_contact);
      }
      
      // Update basic details
      const basicDetails = {};
      if (editedData.age) basicDetails.age = parseInt(editedData.age);
      if (editedData.phone) basicDetails.phone = editedData.phone;
      
      if (Object.keys(basicDetails).length > 0) {
        await updatePatientDetails(patientId, basicDetails);
      }

      // Refresh data
      const updatedData = await getPatientDetails(patientId);
      setPatientData(updatedData);
      setIsEditing(false);
      setEditedData({});
      Alert.alert('Success', 'Patient details updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update patient details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          You don't have permission to view this patient's details
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Details</Text>
        {hasAccess && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{patientData.full_name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.age ?? patientData.age?.toString()}
              onChangeText={(text) => setEditedData({ ...editedData, age: text })}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.value}>{patientData.age}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.phone ?? patientData.phone}
              onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{patientData.phone}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Information</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Medical History:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={editedData.medical_history ?? patientData.medical_history}
              onChangeText={(text) =>
                setEditedData({ ...editedData, medical_history: text })
              }
              multiline
            />
          ) : (
            <Text style={styles.value}>{patientData.medical_history}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Medications:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={
                editedData.medications ??
                patientData.medications?.join(', ')
              }
              onChangeText={(text) =>
                setEditedData({ ...editedData, medications: text })
              }
              multiline
              placeholder="Enter medications separated by commas"
            />
          ) : (
            <Text style={styles.value}>
              {patientData.medications?.join(', ')}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <View style={styles.field}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.emergency_contact ?? patientData.emergency_contact}
              onChangeText={(text) =>
                setEditedData({ ...editedData, emergency_contact: text })
              }
              placeholder="Name: xxx-xxx-xxxx"
            />
          ) : (
            <Text style={styles.value}>{patientData.emergency_contact}</Text>
          )}
        </View>
      </View>

      {isEditing && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PatientDetailsScreen;

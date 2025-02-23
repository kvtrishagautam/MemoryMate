import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get current user data from AsyncStorage
const getCurrentUserData = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
    const userData = await getCurrentUserData();
    return !!userData;
};

// Get current user's role
export const getCurrentUserRole = async () => {
    try {
        const userData = await getCurrentUserData();
        return userData?.role || null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
};

// Check if user is a caretaker
export const isCaretaker = async () => {
    const role = await getCurrentUserRole();
    return role === 'caretaker';
};

// Check if user is a patient
export const isPatient = async () => {
    const role = await getCurrentUserRole();
    return role === 'patient';
};

// Check if caretaker has permission for specific patient
export const hasCaretakerPermission = async (patientId) => {
    try {
        const userData = await getCurrentUserData();
        if (!userData || userData.role !== 'caretaker') return false;

        const { data: relationship, error } = await supabase
            .from('patient_caretaker_relationships')
            .select('status')
            .eq('caretaker_id', userData.id)
            .eq('patient_id', patientId)
            .eq('status', 'accepted')
            .single();

        if (error || !relationship) return false;
        return true;
    } catch (error) {
        console.error('Error checking caretaker permission:', error);
        return false;
    }
};

// Check if user is the patient themselves
export const isOwnPatient = async (patientId) => {
    try {
        const userData = await getCurrentUserData();
        if (!userData || userData.role !== 'patient') return false;
        return userData.id === patientId;
    } catch (error) {
        console.error('Error checking own patient:', error);
        return false;
    }
};

// Check if user has any access to patient data (either as caretaker or patient)
export const hasPatientAccess = async (patientId) => {
    const [isOwn, hasPermission] = await Promise.all([
        isOwnPatient(patientId),
        hasCaretakerPermission(patientId)
    ]);
    return isOwn || hasPermission;
};

const permissionChecks = {
    isAuthenticated,
    getCurrentUserRole,
    isCaretaker,
    isPatient,
    hasCaretakerPermission,
    isOwnPatient,
    hasPatientAccess
};

export default permissionChecks;

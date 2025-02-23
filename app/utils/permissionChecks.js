import { supabase } from '../lib/supabase';

// Check if user is authenticated
export const isAuthenticated = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
};

// Get current user's role
export const getCurrentUserRole = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        return profile?.role || null;
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: caretaker } = await supabase
            .from('caretaker_details')
            .select('assigned_patient_id')
            .eq('id', user.id)
            .eq('assigned_patient_id', patientId)
            .single();

        return !!caretaker;
    } catch (error) {
        console.error('Error checking caretaker permission:', error);
        return false;
    }
};

// Check if user is the patient themselves
export const isOwnPatient = async (patientId) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: patient } = await supabase
            .from('patient_details')
            .select('patient_id')
            .eq('id', user.id)
            .eq('patient_id', patientId)
            .single();

        return !!patient;
    } catch (error) {
        console.error('Error checking patient ownership:', error);
        return false;
    }
};

// Check if user has any access to patient data (either as caretaker or patient)
export const hasPatientAccess = async (patientId) => {
    const isOwn = await isOwnPatient(patientId);
    if (isOwn) return true;

    const hasPermission = await hasCaretakerPermission(patientId);
    return hasPermission;
};

const permissionChecks = {
    isAuthenticated,
    getCurrentUserRole,
    isCaretaker,
    isPatient,
    hasCaretakerPermission,
    isOwnPatient,
    hasPatientAccess,
};

export default permissionChecks;

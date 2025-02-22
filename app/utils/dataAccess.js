import { supabase } from '../lib/supabase';
import { hasPatientAccess } from './permissionChecks';

// Patient Data Access
export const getPatientDetails = async (patientId) => {
    try {
        const hasAccess = await hasPatientAccess(patientId);
        if (!hasAccess) {
            throw new Error('You do not have permission to access this patient\'s details');
        }

        const { data, error } = await supabase
            .from('patient_details')
            .select(`
                *,
                profiles:profiles(full_name)
            `)
            .eq('patient_id', patientId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching patient details:', error);
        throw error;
    }
};

export const updatePatientDetails = async (patientId, updates) => {
    try {
        const hasAccess = await hasPatientAccess(patientId);
        if (!hasAccess) {
            throw new Error('You do not have permission to update this patient\'s details');
        }

        const { data, error } = await supabase
            .from('patient_details')
            .update(updates)
            .eq('patient_id', patientId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating patient details:', error);
        throw error;
    }
};

// Caretaker Data Access
export const getCaretakerDetails = async (caretakerId) => {
    try {
        const { data, error } = await supabase
            .from('caretaker_details')
            .select(`
                *,
                profiles:profiles(full_name)
            `)
            .eq('id', caretakerId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching caretaker details:', error);
        throw error;
    }
};

export const getAssignedPatients = async (caretakerId) => {
    try {
        const { data, error } = await supabase
            .from('patient_details')
            .select(`
                *,
                profiles:profiles(full_name)
            `)
            .eq('patient_id', (
                supabase
                    .from('caretaker_details')
                    .select('assigned_patient_id')
                    .eq('id', caretakerId)
            ));

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching assigned patients:', error);
        throw error;
    }
};

export const getAssignedCaretakers = async (patientId) => {
    try {
        const { data, error } = await supabase
            .from('caretaker_details')
            .select(`
                *,
                profiles:profiles(full_name)
            `)
            .eq('assigned_patient_id', patientId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching assigned caretakers:', error);
        throw error;
    }
};

// Medical Records Access
export const updateMedicalHistory = async (patientId, medicalHistory) => {
    try {
        const hasAccess = await hasPatientAccess(patientId);
        if (!hasAccess) {
            throw new Error('You do not have permission to update medical history');
        }

        const { data, error } = await supabase
            .from('patient_details')
            .update({ medical_history: medicalHistory })
            .eq('patient_id', patientId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating medical history:', error);
        throw error;
    }
};

export const updateMedications = async (patientId, medications) => {
    try {
        const hasAccess = await hasPatientAccess(patientId);
        if (!hasAccess) {
            throw new Error('You do not have permission to update medications');
        }

        const { data, error } = await supabase
            .from('patient_details')
            .update({ medications })
            .eq('patient_id', patientId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating medications:', error);
        throw error;
    }
};

// Emergency Contact Access
export const updateEmergencyContact = async (patientId, emergencyContact) => {
    try {
        const hasAccess = await hasPatientAccess(patientId);
        if (!hasAccess) {
            throw new Error('You do not have permission to update emergency contact');
        }

        const { data, error } = await supabase
            .from('patient_details')
            .update({ emergency_contact: emergencyContact })
            .eq('patient_id', patientId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating emergency contact:', error);
        throw error;
    }
};

const dataAccess = {
    getPatientDetails,
    updatePatientDetails,
    getCaretakerDetails,
    getAssignedPatients,
    getAssignedCaretakers,
    updateMedicalHistory,
    updateMedications,
    updateEmergencyContact,
};

export default dataAccess;

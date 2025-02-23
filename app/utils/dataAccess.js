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
            .from('patients')
            .select('*')
            .eq('id', patientId)
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
            .from('patients')
            .update(updates)
            .eq('id', patientId)
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
            .from('caretakers')
            .select('*')
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
            .from('patient_caretaker_relationships')
            .select(`
                patient_id,
                status,
                patient:patients (*)
            `)
            .eq('caretaker_id', caretakerId)
            .eq('status', 'accepted');

        if (error) throw error;
        return data?.map(rel => rel.patient) || [];
    } catch (error) {
        console.error('Error fetching assigned patients:', error);
        throw error;
    }
};

export const getAssignedCaretakers = async (patientId) => {
    try {
        const { data, error } = await supabase
            .from('patient_caretaker_relationships')
            .select(`
                caretaker_id,
                status,
                caretaker:caretakers (*)
            `)
            .eq('patient_id', patientId)
            .eq('status', 'accepted');

        if (error) throw error;
        return data?.map(rel => rel.caretaker) || [];
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
            throw new Error('You do not have permission to update this patient\'s medical history');
        }

        const { data, error } = await supabase
            .from('patients')
            .update({ medical_conditions: medicalHistory })
            .eq('id', patientId)
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
            throw new Error('You do not have permission to update this patient\'s medications');
        }

        const { data, error } = await supabase
            .from('patients')
            .update({ medications })
            .eq('id', patientId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating medications:', error);
        throw error;
    }
};

export const updateEmergencyContact = async (patientId, emergencyContact) => {
    try {
        const hasAccess = await hasPatientAccess(patientId);
        if (!hasAccess) {
            throw new Error('You do not have permission to update this patient\'s emergency contact');
        }

        const { data, error } = await supabase
            .from('patients')
            .update({
                emergency_contact: emergencyContact.name,
                emergency_contact_number: emergencyContact.phone
            })
            .eq('id', patientId)
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
    updateEmergencyContact
};

export default dataAccess;

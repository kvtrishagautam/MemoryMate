-- Insert sample patients
insert into patients (
    full_name,
    user_id,
    age,
    email,
    gender,
    medical_cond,
    emergency_contact,
    emergency_contact_2,
    avatar_url,
    location_tracking_enabled,
    mobility_status,
    cognitive_status,
    blood_group,
    allergies,
    primary_doctor,
    preferred_language,
    diet_restrictions,
    medication_schedule,
    daily_routine
) values
(
    'John Smith',
    'user_123',
    72,
    'john.smith@email.com',
    'Male',
    'Early-stage Alzheimer''s',
    '+1-555-0123',
    '+1-555-0124',
    'https://via.placeholder.com/100',
    true,
    'Needs Assistance',
    'Mild',
    'O+',
    ARRAY['Penicillin'],
    'Dr. Sarah Wilson',
    'English',
    ARRAY['Low-sodium'],
    '{"medications": [
        {"name": "Donepezil", "dosage": "10mg", "time": "08:00", "frequency": "daily"},
        {"name": "Vitamin B12", "dosage": "1000mcg", "time": "09:00", "frequency": "daily"}
    ]}'::jsonb,
    '{"activities": [
        {"activity": "Morning Walk", "time": "07:00", "duration": "30min"},
        {"activity": "Memory Games", "time": "10:00", "duration": "45min"},
        {"activity": "Rest", "time": "13:00", "duration": "1h"}
    ]}'::jsonb
),
(
    'Mary Johnson',
    'user_124',
    68,
    'mary.johnson@email.com',
    'Female',
    'Mild Dementia',
    '+1-555-0125',
    '+1-555-0126',
    'https://via.placeholder.com/100',
    true,
    'Independent',
    'Mild',
    'A+',
    ARRAY['Sulfa'],
    'Dr. Michael Brown',
    'English',
    ARRAY['Diabetic'],
    '{"medications": [
        {"name": "Memantine", "dosage": "5mg", "time": "08:00", "frequency": "twice-daily"},
        {"name": "Vitamin D", "dosage": "2000IU", "time": "09:00", "frequency": "daily"}
    ]}'::jsonb,
    '{"activities": [
        {"activity": "Yoga", "time": "08:00", "duration": "45min"},
        {"activity": "Art Therapy", "time": "11:00", "duration": "1h"},
        {"activity": "Social Group", "time": "14:00", "duration": "1h"}
    ]}'::jsonb
);

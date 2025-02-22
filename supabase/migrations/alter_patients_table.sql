-- Add only essential columns for tracking and care features
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS location_tracking_enabled boolean default false,
ADD COLUMN IF NOT EXISTS last_known_location jsonb,
ADD COLUMN IF NOT EXISTS geofence_enabled boolean default false,
ADD COLUMN IF NOT EXISTS geofence_radius integer default 100,
ADD COLUMN IF NOT EXISTS geofence_center jsonb,
ADD COLUMN IF NOT EXISTS cognitive_status text check (cognitive_status in ('Mild', 'Moderate', 'Severe')),
ADD COLUMN IF NOT EXISTS medication_schedule jsonb,
ADD COLUMN IF NOT EXISTS daily_routine jsonb,
ADD COLUMN caretaker_id UUID REFERENCES auth.users(id),
ADD CONSTRAINT one_patient_per_caretaker UNIQUE (caretaker_id);

-- Remove any existing relationships to ensure one-to-one
DELETE FROM patients WHERE id NOT IN (
    SELECT DISTINCT ON (caretaker_id) id 
    FROM patients 
    WHERE caretaker_id IS NOT NULL 
    ORDER BY caretaker_id, created_at ASC
);

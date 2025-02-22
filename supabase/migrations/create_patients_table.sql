-- Create patients table
create table patients (
    id uuid primary key default uuid_generate_v4(),
    full_name text,
    user_id text,
    age int4,
    email text,
    gender text,
    medical_cond text,
    emergency_contact text,
    emergency_contact_2 text,
    created_at timestamptz default timezone('utc'::text, now()),
    updated_at timestamptz default timezone('utc'::text, now()),
    -- Additional columns for patient tracking and care
    avatar_url text,
    location_tracking_enabled boolean default false,
    last_known_location jsonb,
    geofence_enabled boolean default false,
    geofence_radius integer default 100, -- in meters
    geofence_center jsonb, -- {lat: number, lng: number}
    medication_schedule jsonb, -- Array of medication times and details
    daily_routine jsonb, -- Daily schedule and activities
    notes text, -- General notes about the patient
    last_check_in timestamptz,
    next_appointment timestamptz,
    primary_doctor text,
    blood_group text,
    allergies text[],
    mobility_status text check (mobility_status in ('Independent', 'Needs Assistance', 'Wheelchair', 'Bedridden')),
    cognitive_status text check (cognitive_status in ('Mild', 'Moderate', 'Severe')),
    preferred_language text,
    diet_restrictions text[]
);

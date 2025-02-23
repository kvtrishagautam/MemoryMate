-- Create profiles table for both patients and caretakers
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    user_id text unique,
    age integer,
    email text unique,
    role text check (role in ('patient', 'caretaker')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create patient_caretaker_relationships table
create table if not exists public.patient_caretaker_relationships (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references public.profiles(id) on delete cascade,
    caretaker_id uuid references public.profiles(id) on delete cascade,
    status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(patient_id, caretaker_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.patient_caretaker_relationships enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
    on profiles for select
    using ( true );

create policy "Users can insert their own profile."
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update own profile."
    on profiles for update
    using ( auth.uid() = id );

-- Policies for patient_caretaker_relationships
create policy "Patients and caretakers can view their relationships"
    on patient_caretaker_relationships for select
    using ( auth.uid() in (patient_id, caretaker_id) );

create policy "Patients and caretakers can create relationships"
    on patient_caretaker_relationships for insert
    with check ( auth.uid() in (patient_id, caretaker_id) );

create policy "Patients and caretakers can update their relationships"
    on patient_caretaker_relationships for update
    using ( auth.uid() in (patient_id, caretaker_id) );

-- Create functions
create or replace function public.get_user_role(user_id uuid)
returns text
language sql
security definer
as $$
  select role from public.profiles where id = user_id;
$$;

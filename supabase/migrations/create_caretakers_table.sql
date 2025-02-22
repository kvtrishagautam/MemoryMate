-- Create caretakers table
create table caretakers (
    id uuid primary key default uuid_generate_v4(),
    user_id text references auth.users(id),
    full_name text not null,
    email text not null,
    phone_number text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

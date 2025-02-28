import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Simple custom hash function
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

// Initialize database tables
const initializeTables = async () => {
  try {
    // Check if users table exists
    const { error: checkUsersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    // If users table doesn't exist, create it
    if (checkUsersError && checkUsersError.message.includes('relation "users" does not exist')) {
      console.log('Creating users table...');
      
      const { error: createUsersError } = await supabase
        .from('_sql')
        .insert({
          query: `
            CREATE TABLE IF NOT EXISTS public.users (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              email TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              role TEXT NOT NULL,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Enable Row Level Security
            ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Users can read their own data" 
              ON public.users FOR SELECT
              USING (id = current_setting('app.user_id')::UUID);
          `
        });

      if (createUsersError) {
        console.error('Error creating users table:', createUsersError);
      } else {
        console.log('Users table created successfully');
      }
    }

    // Check if profiles table exists
    const { error: checkProfilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    // If profiles table doesn't exist, create it
    if (checkProfilesError && checkProfilesError.message.includes('relation "profiles" does not exist')) {
      console.log('Creating profiles table...');
      
      const { error: createProfilesError } = await supabase
        .from('_sql')
        .insert({
          query: `
            CREATE TABLE IF NOT EXISTS public.profiles (
              id UUID PRIMARY KEY REFERENCES public.users(id),
              full_name TEXT,
              phone TEXT,
              age INTEGER,
              patient_id TEXT,
              specialization TEXT,
              experience INTEGER,
              assigned_patient_id TEXT,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Enable Row Level Security
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Profiles are viewable by owner" 
              ON public.profiles FOR SELECT
              USING (id = current_setting('app.user_id')::UUID);

            CREATE POLICY "Users can update own profile"
              ON public.profiles FOR UPDATE
              USING (id = current_setting('app.user_id')::UUID);
          `
        });

      if (createProfilesError) {
        console.error('Error creating profiles table:', createProfilesError);
      } else {
        console.log('Profiles table created successfully');
      }
    }

    // Check if tasks table exists
    const { error: checkTasksError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    // If tasks table doesn't exist, create it
    if (checkTasksError && checkTasksError.message.includes('relation "tasks" does not exist')) {
      console.log('Creating tasks table...');
      
      const { error: createTasksError } = await supabase
        .from('_sql')
        .insert({
          query: `
            CREATE TABLE IF NOT EXISTS public.tasks (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              title TEXT NOT NULL,
              description TEXT,
              completed BOOLEAN DEFAULT FALSE,
              patient_id UUID REFERENCES public.users(id),
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- Enable Row Level Security
            ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Users can read their own tasks" 
              ON public.tasks FOR SELECT
              USING (patient_id = current_setting('app.user_id')::UUID);
            
            CREATE POLICY "Users can update their own tasks" 
              ON public.tasks FOR UPDATE
              USING (patient_id = current_setting('app.user_id')::UUID);
          `
        });

      if (createTasksError) {
        console.error('Error creating tasks table:', createTasksError);
      } else {
        console.log('Tasks table created successfully');
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize tables when the app starts
initializeTables();

export { supabase, simpleHash };

export const database = {
  async signUp({ email, password, role }) {
    try {
      const hashedPassword = simpleHash(password);
      
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return { error: { message: 'User already exists' } };
      }

      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          { email, password: hashedPassword, role }
        ])
        .select()
        .single();

      if (error) throw error;

      return { data: { user: data }, error: null };
    } catch (error) {
      console.error('Error in database signUp:', error);
      return { data: null, error };
    }
  },

  async signIn({ email, password }) {
    try {
      const hashedPassword = simpleHash(password);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', hashedPassword)
        .single();

      if (error) throw error;
      
      if (!data) {
        return { error: { message: 'Invalid email or password' } };
      }

      return { data: { user: data }, error: null };
    } catch (error) {
      console.error('Error in database signIn:', error);
      return { data: null, error };
    }
  },

  profiles: {
    async get(userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    },

    async update(userId, updates) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    },

    async create(profile) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .insert([profile]);
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
  },

  caretakers: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            profiles(*)
          `)
          .eq('role', 'caretaker');
        
        if (error) {
          throw error;
        }
        return data;
      } catch (error) {
        console.error('Caretakers getAll error:', error);
        throw error;
      }
    },

    async getPatients(caretakerId) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            profiles(*)
          `)
          .eq('role', 'patient')
          .eq('profiles.assigned_caretaker_id', caretakerId);
        
        if (error) {
          throw error;
        }
        return data;
      } catch (error) {
        console.error('Caretaker getPatients error:', error);
        throw error;
      }
    }
  },

  patients: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            profiles(*)
          `)
          .eq('role', 'patient');
        
        if (error) {
          throw error;
        }
        return data;
      } catch (error) {
        console.error('Patients getAll error:', error);
        throw error;
      }
    },

    async getCaretakers(patientId) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            profiles(*)
          `)
          .eq('role', 'caretaker')
          .eq('profiles.assigned_patient_id', patientId);
        
        if (error) {
          throw error;
        }
        return data;
      } catch (error) {
        console.error('Patient getCaretakers error:', error);
        throw error;
      }
    }
  }
};

export const TaskService = {
  getTasks: async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting tasks:', error);
      return null;
    }
  },

  createTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  updateTaskCompletion: async (taskId, completed) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed, updated_at: new Date() })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }
};

export default database;

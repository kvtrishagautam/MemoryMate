import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://neljxamkitzcsfvfvfuy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbGp4YW1raXR6Y3NmdmZ2ZnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzI0MzAsImV4cCI6MjA1NTgwODQzMH0.0KMbshallgwTYHCniSUZhzdA5x1K4oZ_Ki3fisE_xgM';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { supabase };
export default supabase;

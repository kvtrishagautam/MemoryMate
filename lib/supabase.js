import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://neljxamkitzcsfvfvfuy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbGp4YW1raXR6Y3NmdmZ2ZnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzI0MzAsImV4cCI6MjA1NTgwODQzMH0.0KMbshallgwTYHCniSUZhzdA5x1K4oZ_Ki3fisE_xgM';

console.log('Initializing Supabase with:', {
  url: supabaseUrl,
  anonKey: supabaseAnonKey.substring(0, 10) + '...' // Only log part of the key for security
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

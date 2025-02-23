import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Check active sessions and sets the user
    checkUser();

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Error checking user session:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signIn({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signUp({ email, password, userData }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem('userData');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

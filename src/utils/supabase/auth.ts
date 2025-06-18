
// Auth utilities for Supabase
import { supabase } from '@/integrations/supabase/client';

const checkSupabaseConfig = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    checkSupabaseConfig();
    
    const { data, error } = await supabase!.auth.signUp({ 
      email, 
      password
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error during signUp:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    checkSupabaseConfig();
    
    const { data, error } = await supabase!.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error during signIn:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    checkSupabaseConfig();
    
    const { error } = await supabase!.auth.signOut();
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error during signOut:', error);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    checkSupabaseConfig();
    
    const { data, error } = await supabase!.auth.resetPasswordForEmail(email);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error during resetPassword:', error);
    return { data: null, error };
  }
};

export const updatePassword = async (password: string) => {
  try {
    checkSupabaseConfig();
    
    const { data, error } = await supabase!.auth.updateUser({ password });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error during updatePassword:', error);
    return { data: null, error };
  }
};

export const getCurrentUser = async () => {
  try {
    checkSupabaseConfig();
    
    const { data, error } = await supabase!.auth.getUser();
    
    if (error) throw error;
    
    return { user: data?.user || null, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

export const isAdmin = async () => {
  try {
    checkSupabaseConfig();
    
    const { data, error } = await supabase!.rpc('is_admin');
    
    if (error) throw error;
    
    return data === true;
  } catch (error) {
    console.error('Error checking if user is admin:', error);
    return false;
  }
};

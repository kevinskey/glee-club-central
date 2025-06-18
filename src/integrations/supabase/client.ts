
import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and key from Vite environment variables
const envUrl = import.meta.env.SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

if (!envUrl || !envAnonKey) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required.'
  );
}

const supabaseUrl = envUrl;
const supabaseAnonKey = envAnonKey;

// Create a single instance of the Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Function to clean up authentication state, useful when switching users
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

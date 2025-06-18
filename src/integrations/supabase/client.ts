
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Get the Supabase URL and key from Vite environment variables
const envUrl = import.meta.env.SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

let supabaseUrl: string | undefined = envUrl;
let supabaseAnonKey: string | undefined = envAnonKey;

if (!envUrl || !envAnonKey) {
  // In local/test environments the Supabase credentials may be missing.
  // Instead of throwing an error (which would break the entire app),
  // log a warning and export `null`. Components can handle this case by
  // falling back to default behaviour.
  console.warn(
    'Supabase environment variables missing. Features depending on Supabase will be disabled.'
  );
  supabaseUrl = undefined;
  supabaseAnonKey = undefined;
}

// Create a single instance of the Supabase client if credentials exist
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: localStorage,
          persistSession: true,
          autoRefreshToken: true,
        }
      })
    : null;

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

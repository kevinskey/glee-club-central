
import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and key from Vite environment variables
const envUrl = import.meta.env.SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

if (!envUrl || !envAnonKey) {
  console.warn(
    'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables. Using fallback credentials.'
  );
}

const supabaseUrl = envUrl ?? 'https://dzzptovqfqausipsgabw.supabase.co';
const supabaseAnonKey =
  envAnonKey ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enB0b3ZxZnFhdXNpcHNnYWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDM1MjksImV4cCI6MjA2MTk3OTUyOX0.7jSsV-y-32C7f23rw6smPPzuQs6HsQeKpySP4ae_C5s';

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

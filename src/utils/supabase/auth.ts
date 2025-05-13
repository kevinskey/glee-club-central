
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Sign in error:", error);
    return { data: null, error };
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(scope: 'local' | 'global' = 'local') {
  try {
    const { error } = await supabase.auth.signOut({ scope });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return { error };
  }
}

/**
 * Check if the user session is valid
 */
export async function checkSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return { 
      session: data.session, 
      isValid: !!data.session,
      error: null 
    };
  } catch (error) {
    console.error("Session check error:", error);
    return { 
      session: null, 
      isValid: false,
      error 
    };
  }
}

/**
 * Get user role from profile
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.role as UserRole || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

/**
 * Reset password for email
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error };
  }
}

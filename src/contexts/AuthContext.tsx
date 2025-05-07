import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Define types for user roles and status
export type UserRole = 'administrator' | 'section_leader' | 'singer' | 'student_conductor' | 'accompanist' | 'member' | 'non_singer';
export type MemberStatus = 'active' | 'inactive' | 'pending' | 'alumni' | 'deleted';
export type VoicePart = 'soprano_1' | 'soprano_2' | 'alto_1' | 'alto_2' | 'tenor' | 'bass' | null;

// Define Profile type for additional user information
export interface Profile {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  voice_part?: VoicePart;
  role: UserRole;
  avatar_url?: string | null;
  status: MemberStatus;
  join_date?: string | null;
  class_year?: string | null;
  dues_paid?: boolean;
  notes?: string | null;
  special_roles?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  profile: Profile | null; // Add profile to context
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null, // Add default profile value
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  isAdmin: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // Add profile state
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from the database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data as Profile);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  useEffect(() => {
    // Get session data
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile if user exists
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        }
      } catch (error: any) {
        console.error('Error getting initial session:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    getInitialSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.info('Auth state change event:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile if user exists after auth change
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };
  
  const signInWithApple = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('Sign up successful! Check your email for confirmation.');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null); // Clear profile on signout
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };
  
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };
  
  const isAdmin = () => {
    return user?.app_metadata?.role === 'admin' || user?.email?.endsWith('@spelman.edu') || profile?.role === 'administrator';
  };

  const value = {
    user,
    session,
    profile, // Include profile in context value
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithGoogle,
    signInWithApple,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import {
  Session,
  User as SupabaseUser,
} from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { Profile } from '@/types/auth';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthUser = SupabaseUser & {
  role: string;
};

interface AuthContextType {
  user: AuthUser | null;
  userProfile: Profile | null;
  permissions: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
  updatePassword?: (newPassword: string) => Promise<void>;
  signInWithGoogle?: () => void;
  signInWithApple?: () => void;
  refreshPermissions?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user role from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile data:", profileError);
            // Handle the error appropriately, e.g., display an error message or retry
          } else if (profileData) {
            // Set the user role from the profile data
            setUser({ ...session.user, role: profileData.role });
            setProfile(profileData);

            // Fetch user permissions
            const permissions = await fetchUserPermissions(session.user.id);
            setPermissions(permissions);
          }
        } else {
          setUser(null);
          setProfile(null);
          setPermissions(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session) {
          // Get the user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({ ...session.user, role: profileData?.role || 'singer' });
          setProfile(profileData || null);
          
          // Fetch user permissions
          const permissions = await fetchUserPermissions(session.user.id);
          setPermissions(permissions);
        } else {
          setUser(null);
          setProfile(null);
          setPermissions(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshPermissions = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch updated permissions
      const permissions = await fetchUserPermissions(user.id);
      setPermissions(permissions);
      
      // Re-fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
      
      return permissions;
    } catch (error) {
      console.error('Error refreshing permissions:', error);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Sign-in error:", error);
        toast.error("Invalid credentials");
        return { error };
      }
      toast.success("Signed in successfully!");
      return { error: null };
    } catch (err: any) {
      console.error("Unexpected sign-in error:", err);
      toast.error("An unexpected error occurred during sign-in.");
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error("Sign-up error:", error);
        toast.error("Failed to sign up");
        return { error, data: null };
      }

      // After successful signup, update the profile table
      if (data.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          // Optionally, sign out the user if profile update fails
          await supabase.auth.signOut();
          toast.error("Failed to update profile. Please sign in again.");
          return { error: profileError, data: null };
        }
      }
      toast.success("Signed up successfully!");
      return { error: null, data };
    } catch (err: any) {
      console.error("Unexpected sign-up error:", err);
      toast.error("An unexpected error occurred during sign-up.");
      return { error: err, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      setUser(null);
      setProfile(null);
      setPermissions(null);
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === 'administrator';
  };

  const hasPermission = (permission: string): boolean => {
    return !!permissions?.[permission];
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error("Password update error:", error);
        toast.error("Failed to update password");
      } else {
        console.log("Password updated successfully:", data);
        toast.success("Password updated successfully!");
      }
    } catch (err: any) {
      console.error("Unexpected password update error:", err);
      toast.error("An unexpected error occurred during password update.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        console.error("Google sign-in error:", error);
        toast.error("Failed to sign in with Google");
      } else {
        console.log("Google sign-in initiated:", data);
        toast.success("Signed in with Google successfully!");
      }
    } catch (err: any) {
      console.error("Unexpected Google sign-in error:", err);
      toast.error("An unexpected error occurred during Google sign-in.");
    }
  };

  const signInWithApple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });
      if (error) {
        console.error("Apple sign-in error:", error);
        toast.error("Failed to sign in with Apple");
      } else {
        console.log("Apple sign-in initiated:", data);
        toast.success("Signed in with Apple successfully!");
      }
    } catch (err: any) {
      console.error("Unexpected Apple sign-in error:", err);
      toast.error("An unexpected error occurred during Apple sign-in.");
    }
  };

  const value: AuthContextType = {
    user,
    userProfile: profile, // Set userProfile to be the same as profile
    profile,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    permissions,
    signIn,
    signOut,
    signUp,
    isAdmin,
    hasPermission,
    updatePassword,
    refreshPermissions,
    signInWithGoogle,
    signInWithApple,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

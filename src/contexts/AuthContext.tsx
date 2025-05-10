
import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import {
  Session,
  User as SupabaseUser,
} from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { Profile } from '@/types/auth';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
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
  refreshPermissions?: () => Promise<any>; // Updated return type to be more flexible
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

  // Initialize auth state and set up listener
  useEffect(() => {
    console.log("Setting up auth state...");
    
    // Set up the auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session) {
          console.log("Session found, user is authenticated:", session.user.email);
          // Set user immediately to prevent flicker
          setUser({ ...session.user, role: 'singer' }); // Default role until we get the profile

          // Defer profile and permissions loading to avoid deadlocks
          setTimeout(async () => {
            try {
              // Get the user profile
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profileError) {
                console.error("Profile fetch error:", profileError);
              }

              if (profileData) {
                console.log("Profile loaded:", profileData.first_name, profileData.last_name);
                setUser({ ...session.user, role: profileData.role || 'singer' });
                setProfile(profileData);
                
                // Fetch user permissions
                try {
                  const permissions = await fetchUserPermissions(session.user.id);
                  setPermissions(permissions);
                } catch (permErr) {
                  console.error("Error fetching permissions:", permErr);
                }
              } else {
                console.warn("No profile found for user:", session.user.id);
              }
            } catch (err) {
              console.error("Error loading user data after auth change:", err);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          console.log("No session, user is not authenticated");
          setUser(null);
          setProfile(null);
          setPermissions(null);
          setLoading(false);
        }
      }
    );

    // Then check for an existing session
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Existing session found for:", session.user.email);
          
          // Set user immediately with default role
          setUser({ ...session.user, role: 'singer' }); // Default role until we get the profile
          
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
            console.log("Profile data loaded:", profileData.first_name, profileData.role);
            // Set the user role from the profile data
            setUser({ ...session.user, role: profileData.role || 'singer' });
            setProfile(profileData);

            // Fetch user permissions
            try {
              const permissions = await fetchUserPermissions(session.user.id);
              setPermissions(permissions);
            } catch (permErr) {
              console.error("Error fetching permissions:", permErr);
            }
          } else {
            console.warn("No profile found for user:", session.user.id);
          }
        } else {
          console.log("No existing session found");
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshPermissions = useCallback(async () => {
    if (!user) return null;
    
    try {
      console.log("Refreshing permissions for user:", user.id);
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
        console.log("Refreshed profile data:", profileData.first_name, profileData.role);
        setProfile(profileData);
      }
      
      return permissions;
    } catch (error) {
      console.error('Error refreshing permissions:', error);
      return null;
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Sign-in attempt for:", email);
      // Clean up existing auth state to prevent issues
      cleanupAuthState();
      
      // Try to sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Sign-out before sign-in failed, continuing anyway");
      }
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Sign-in error:", error);
        return { error };
      }
      
      if (data.user) {
        console.log("Sign-in successful for:", data.user.email);
        toast.success("Signed in successfully!");
        
        // Use navigate instead of forced reload for smoother experience
        navigate('/dashboard');
      }
      
      return { error: null };
    } catch (err: any) {
      console.error("Unexpected sign-in error:", err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log("Sign-up attempt for:", email);
      // Clean up existing auth state first
      cleanupAuthState();
      
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
        return { error, data: null };
      }

      // After successful signup, update the profile table
      if (data.user?.id) {
        console.log("User created, updating profile for:", data.user.email);
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
          return { error: profileError, data: null };
        }
      }
      console.log("Sign-up successful for:", email);
      toast.success("Signed up successfully! Please check your email to confirm your account.");
      return { error: null, data };
    } catch (err: any) {
      console.error("Unexpected sign-up error:", err);
      return { error: err, data: null };
    }
  };

  const signOut = async () => {
    try {
      console.log("Sign-out attempt");
      // Clean up auth state first
      cleanupAuthState();
      
      // Perform the sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear state
      setUser(null);
      setProfile(null);
      setPermissions(null);
      
      // Navigate to login
      navigate('/login');
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
      
      // Force a hard reload as a last resort
      window.location.href = '/login';
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
        console.log("Password updated successfully");
        toast.success("Password updated successfully!");
      }
    } catch (err: any) {
      console.error("Unexpected password update error:", err);
      toast.error("An unexpected error occurred during password update.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Sign-in with Google attempt");
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        console.error("Google sign-in error:", error);
        toast.error("Failed to sign in with Google");
      } else {
        console.log("Google sign-in initiated");
      }
    } catch (err: any) {
      console.error("Unexpected Google sign-in error:", err);
      toast.error("An unexpected error occurred during Google sign-in.");
    }
  };

  const signInWithApple = async () => {
    try {
      console.log("Sign-in with Apple attempt");
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });
      if (error) {
        console.error("Apple sign-in error:", error);
        toast.error("Failed to sign in with Apple");
      } else {
        console.log("Apple sign-in initiated");
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

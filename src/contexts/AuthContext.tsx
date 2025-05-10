
import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  Session,
  User as SupabaseUser,
} from '@supabase/supabase-js';
import { Profile } from '@/types/auth';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthUser = SupabaseUser & {
  role: string;
};

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions?: Record<string, boolean>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  updatePassword?: (newPassword: string) => Promise<void>;
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
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to refresh permissions
  const refreshPermissions = async () => {
    if (!user) return;
    
    try {
      const { data: permissionsData } = await supabase
        .rpc('get_user_permissions', { p_user_id: user.id });
      
      if (permissionsData) {
        const permMap: Record<string, boolean> = {};
        permissionsData.forEach((item: any) => {
          permMap[item.permission] = item.granted;
        });
        setPermissions(permMap);
      }
    } catch (permError) {
      console.error("Error loading permissions:", permError);
    }
  };

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
          setUser({ ...session.user, role: 'general' }); // Default role until we get the profile

          // Defer profile loading to avoid deadlocks
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
                setUser({ ...session.user, role: profileData.role || 'general' });
                setProfile(profileData);

                // Load user permissions if available
                try {
                  const { data: permissionsData } = await supabase
                    .rpc('get_user_permissions', { p_user_id: session.user.id });
                  
                  if (permissionsData) {
                    const permMap: Record<string, boolean> = {};
                    permissionsData.forEach((item: any) => {
                      permMap[item.permission] = item.granted;
                    });
                    setPermissions(permMap);
                  }
                } catch (permError) {
                  console.error("Error loading permissions:", permError);
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
          setPermissions({});
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
          setUser({ ...session.user, role: 'general' }); // Default role until we get the profile
          
          // Fetch user role from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile data:", profileError);
          } else if (profileData) {
            console.log("Profile data loaded:", profileData.first_name, profileData.role);
            setUser({ ...session.user, role: profileData.role || 'general' });
            setProfile(profileData);

            // Load user permissions
            try {
              const { data: permissionsData } = await supabase
                .rpc('get_user_permissions', { p_user_id: session.user.id });
              
              if (permissionsData) {
                const permMap: Record<string, boolean> = {};
                permissionsData.forEach((item: any) => {
                  permMap[item.permission] = item.granted;
                });
                setPermissions(permMap);
              }
            } catch (permError) {
              console.error("Error loading permissions:", permError);
            }
          } else {
            console.warn("No profile found for user:", session.user.id);
          }
        } else {
          console.log("No existing session found");
          setUser(null);
          setProfile(null);
          setPermissions({});
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
        
        // Update last_login time in profile
        await supabase
          .from('profiles')
          .update({ 
            last_login: new Date().toISOString() 
          })
          .eq('id', data.user.id);
        
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
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        console.error("Sign-up error:", error);
        return { error, data: null };
      }

      console.log("Sign-up response:", data);
      
      // Check if profile exists already (might happen if user is re-registering)
      if (data.user?.id) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
          
        if (!existingProfile) {
          console.log("Creating new profile for:", data.user.email);
          // Create profile manually if trigger didn't work
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              role: 'general', // Default role
              status: 'active', // Default status
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
        } else {
          console.log("User profile already exists, updating it");
          // Update the existing profile
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              first_name: firstName,
              last_name: lastName,
              status: 'active',
            })
            .eq('id', data.user.id);

          if (profileError) {
            console.error("Profile update error:", profileError);
          }
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
      setPermissions({});
      
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
    return user?.role === 'admin';
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

  const value: AuthContextType = {
    user,
    profile,
    permissions,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    signUp,
    isAdmin,
    updatePassword,
    refreshPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

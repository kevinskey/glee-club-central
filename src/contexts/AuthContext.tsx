
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AuthUser, AuthContextType, UserRole } from '@/types/auth';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, boolean> | undefined>(undefined);
  const navigate = useNavigate();

  // Helper function to convert any role string to a valid UserRole
  const mapRoleToAuthUser = (userData: any): AuthUser => {
    // Extract needed properties
    const { id, email, role } = userData;
    
    // Map the role string to one of the allowed UserRole values
    let mappedRole: UserRole = 'general'; // Default to general
    
    if (role === 'admin' || role === 'administrator') {
      mappedRole = 'administrator';
    } else if (role === 'director') {
      mappedRole = 'director';
    } else if (role === 'section_leader' || role === 'singer' || 
               role === 'student_conductor' || role === 'accompanist' || role === 'non_singer') {
      mappedRole = role as UserRole;
    }
    
    return {
      id,
      email: email || undefined,
      role: mappedRole,
      ...userData, // Include other properties
    };
  };

  useEffect(() => {
    const session = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const authUser = mapRoleToAuthUser(session.user);
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    session()

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
        if (session?.user) {
          const authUser = mapRoleToAuthUser(session.user);
          setUser(authUser);
        } else {
          setUser(null);
        }
        setIsAuthenticated(true);
        await fetchProfile(session?.user?.id);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        setPermissions(undefined);
        navigate('/login');
      } else if (event === 'INITIAL_SESSION') {
        console.log('Initial session:', session?.user);
        if (session?.user) {
          const authUser = mapRoleToAuthUser(session.user);
          setUser(authUser);
        } else {
          setUser(null);
        }
        setIsAuthenticated(!!session?.user);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log('PASSWORD_RECOVERY session:', session?.user);
        if (session?.user) {
          const authUser = mapRoleToAuthUser(session.user);
          setUser(authUser);
        } else {
          setUser(null);
        }
        setIsAuthenticated(!!session?.user);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      }
    })
  }, [navigate]);

  const fetchProfile = async (userId: string | undefined) => {
    if (!userId) {
      console.log("No user ID, cannot fetch profile");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching profile for user:", userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error('Failed to load profile');
        return;
      }

      if (profileData) {
        console.log("Profile data loaded:", profileData);
        setProfile(profileData);
        await refreshPermissions(userId);
      } else {
        console.log("No profile found for user:", userId);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error during profile fetch:", error);
      toast.error('Error fetching profile');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPermissions = async (userId?: string) => {
    const id = userId || user?.id;
    if (!id) {
      console.warn("No user ID available to fetch permissions.");
      return;
    }

    try {
      console.log("Refreshing permissions for user:", id);
      const userPermissions = await fetchUserPermissions(id);
      if (userPermissions) {
        console.log("User permissions loaded:", userPermissions);
        setPermissions(userPermissions);
      } else {
        console.warn("No permissions fetched, or an error occurred.");
        setPermissions({});
      }
    } catch (error) {
      console.error("Error refreshing permissions:", error);
      toast.error('Failed to refresh permissions');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error("Sign-in error:", error);
        toast.error('Sign-in failed');
        return { error };
      }

      toast.success('Sign-in successful');
      return { error: null };
    } catch (err) {
      console.error("Error during sign-in:", err);
      toast.error('Error during sign-in');
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log("Signing up user:", email);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        console.error("Sign-up error:", error);
        toast.error('Sign-up failed');
        return { error, data: null };
      }

      toast.success('Sign-up successful');
      return { error: null, data };
    } catch (err) {
      console.error("Error during sign-up:", err);
      toast.error('Error during sign-up');
      return { error: err, data: null };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign-out error:", error);
        toast.error('Sign-out failed');
        return;
      }

      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err) {
      console.error("Error during sign-out:", err);
      toast.error('Error during sign-out');
    }
  };

  const updatePassword = async (newPassword: string) => {
        try {
            console.log("Updating password");
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                console.error("Update password error:", error);
                toast.error('Failed to update password');
                return;
            }

            toast.success('Password updated successfully');
        } catch (err) {
            console.error("Error during password update:", err);
            toast.error('Error during password update');
        }
    };

  // Check if the user has an admin role
  const isAdmin = useCallback(() => {
    if (!profile) return false;
    return profile.role === 'administrator' || profile.role === 'director' || profile.role === 'admin';
  }, [profile]);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    isLoading,
    permissions,
    signIn,
    signUp,
    signOut,
    isAdmin,
    updatePassword,
    refreshPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

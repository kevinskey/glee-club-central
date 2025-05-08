
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PermissionSet, getUserPermissions } from "@/utils/supabase/user/types";
import { AuthContextType, AuthUser, Profile } from "@/types/auth";
import { toast } from "sonner";

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<PermissionSet | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth status on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        // Check for current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: 'singer' // Default role, will be updated from profile
          } as AuthUser);
          
          // Fetch user profile
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
          setPermissions(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: 'singer' // Default role, will be updated from profile
        } as AuthUser);
        
        // Fetch user profile on auth change
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
        setPermissions(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const profile: Profile = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: user?.email || null,
          role: data.role,
          status: data.status,
          voice_part: data.voice_part,
          phone: data.phone,
          avatar_url: data.avatar_url,
          join_date: data.join_date,
          created_at: data.created_at,
          updated_at: data.updated_at,
          class_year: data.class_year,
          dues_paid: data.dues_paid,
          special_roles: data.special_roles,
          notes: data.notes,
          last_sign_in_at: null // Will be set below if available
        };
        
        // Update user with the correct role from the profile
        if (user) {
          setUser({
            ...user,
            role: data.role as AuthUser['role']
          });
        }
        
        setUserProfile(profile);
        
        // Set user permissions based on their role
        const userPermissions = getUserPermissions(data.role);
        setPermissions(userPermissions);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign in');
      return { error };
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { error, data: null };
      }
      
      toast.success("Account created! You can now sign in.");
      return { error: null, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      return { error, data: null };
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("You have been signed out");
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };
  
  // Check if user is an admin
  const isAdmin = (): boolean => {
    return userProfile?.role === 'administrator';
  };
  
  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!permissions) return false;
    return !!permissions[permission as keyof PermissionSet];
  };
  
  const value = {
    user,
    userProfile,
    permissions,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
    profile: userProfile,
    signIn,
    signUp,
    signOut,
    isAdmin,
    hasPermission
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types
export type { AuthUser, Profile };


import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PermissionSet, getUserPermissions } from "@/utils/supabase/user/types";
import { toast } from "sonner";

// Define types for your application
export type AuthUser = {
  id: string;
  email?: string;
};

export type UserRole = 'administrator' | 'section_leader' | 'singer' | 'student_conductor' | 'accompanist' | 'non_singer';

export type MemberStatus = 'active' | 'inactive' | 'pending' | 'alumni';

export type VoicePart = 'soprano_1' | 'soprano_2' | 'alto_1' | 'alto_2' | 'tenor' | 'bass' | null;

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string | null;
  role: UserRole;
  status: MemberStatus;
  voice_part: VoicePart;
  phone?: string | null;
  avatar_url?: string | null;
  join_date?: string | null;
};

// Define the shape of your context
interface AuthContextType {
  user: AuthUser | null;
  userProfile: Profile | null;
  permissions: PermissionSet | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  hasPermission: (permission: keyof PermissionSet) => boolean;
}

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
            email: session.user.email
          });
          
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
          email: session.user.email
        });
        
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
          email: data.email,
          role: data.role as UserRole,
          status: data.status as MemberStatus,
          voice_part: data.voice_part as VoicePart,
          phone: data.phone,
          avatar_url: data.avatar_url,
          join_date: data.join_date
        };
        
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
  const hasPermission = (permission: keyof PermissionSet): boolean => {
    if (!permissions) return false;
    return !!permissions[permission];
  };
  
  const value = {
    user,
    userProfile,
    permissions,
    loading,
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

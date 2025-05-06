
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Define voice part as an enum
export type VoicePart = "soprano" | "alto" | "tenor" | "bass";
export type UserRole = "admin" | "section_leader" | "member";
export type MemberStatus = "active" | "inactive" | "alumni" | "pending";

export interface Profile {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  role: UserRole;
  voice_part?: VoicePart | null;
  avatar_url?: string | null;
  status: MemberStatus;
  section_id?: string | null;
  join_date?: string | null;
}

export interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  isAdmin: () => boolean;
  isSectionLeader: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase.from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      if (!profileData) {
        return null;
      }

      // Create a profile with defaults for missing properties
      const profileWithDefaults: Profile = {
        id: profileData.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: user?.email || null, // Use email from auth user
        phone: profileData.phone || null, 
        role: (profileData.role as UserRole) || 'member',
        voice_part: profileData.voice_part as VoicePart || null,
        avatar_url: profileData.avatar_url || null, 
        status: (profileData.status as MemberStatus) || 'pending', 
        section_id: profileData.section_id || null, 
        join_date: profileData.join_date || null 
      };
      
      return profileWithDefaults;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    const profile = await fetchProfile(user.id);
    if (profile) {
      setProfile(profile);
    }
  };

  // Update profile data
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('User must be logged in to update profile');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      await refreshProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile');
      throw error;
    }
  };

  // Check session on initial load
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        // Check for active session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          setUser(session.user);
          const profile = await fetchProfile(session.user.id);
          if (profile) {
            setProfile(profile);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          setProfile(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      const profile = await fetchProfile(data.user.id);
      if (profile) {
        setProfile(profile);
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
      throw error;
    }
  };

  // Role checking functions
  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  const isSectionLeader = () => {
    return profile?.role === 'section_leader';
  };

  // Aliases for compatibility
  const login = signIn;
  const logout = signOut;

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    login,
    logout,
    refreshProfile,
    updateProfile,
    isAdmin,
    isSectionLeader,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

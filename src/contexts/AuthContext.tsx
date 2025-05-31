
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '@/types/auth';
import { toast } from 'sonner';

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  voice_part?: string;
  status?: string;
  is_super_admin?: boolean;
  dues_paid?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  hasUser: boolean;
  supabaseClient: typeof supabase;
  permissions: { [key: string]: boolean };
  signOut: () => Promise<void>;
  logout: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, userType?: string) => Promise<{ error: any, data: any }>;
  isAdmin: () => boolean;
  isMember: () => boolean;
  getUserType: () => UserType;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  resetAuthSystem: () => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cleanup utility functions
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

export const resetAuthSystem = async () => {
  try {
    cleanupAuthState();
    await supabase.auth.signOut({ scope: 'global' });
    window.location.href = '/';
    return { success: true };
  } catch (error) {
    console.error('Error resetting auth system:', error);
    return { success: false };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // Show warning about profile loading issue
        if (error.code !== 'PGRST116') { // Not a "no rows" error
          toast.warning('Profile loading issue detected. Please contact support if this persists.');
        }
        return null;
      }

      console.log('Profile loaded successfully:', data);
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load user profile. Some features may be unavailable.');
      return null;
    }
  };

  const fetchPermissions = async (userId: string) => {
    try {
      const { data } = await supabase
        .rpc('get_user_permissions', { p_user_id: userId });
      
      const permissionsMap: { [key: string]: boolean } = {};
      data?.forEach((perm: any) => {
        permissionsMap[perm.permission] = perm.granted;
      });
      
      return permissionsMap;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return {};
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const refreshPermissions = async () => {
    if (user?.id) {
      const permissionsData = await fetchPermissions(user.id);
      setPermissions(permissionsData);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    return login(email, password);
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, userType: string = 'member') => {
    try {
      cleanupAuthState();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      setPermissions({});
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const isAdmin = () => {
    // Check profile-based admin status
    if (profile?.is_super_admin === true || profile?.role === 'admin') {
      console.log('Admin detected via profile:', { is_super_admin: profile.is_super_admin, role: profile.role });
      return true;
    }
    
    // Fallback: Check user metadata for known admin emails
    if (user) {
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      const userType = user.user_metadata?.user_type || user.app_metadata?.user_type;
      
      if (userRole === 'admin' || userRole === 'super_admin' || userType === 'admin') {
        console.log('Admin detected via user metadata fallback:', { userRole, userType });
        return true;
      }
      
      // Check email-based admin detection for known admin emails
      const adminEmails = ['kevinskey@mac.com']; // Add known admin emails here
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        console.log('Admin detected via email whitelist:', user.email);
        return true;
      }
    }
    
    return false;
  };

  const isMember = () => {
    return profile?.role === 'member' || !profile?.role;
  };

  const getUserType = (): UserType => {
    if (isAdmin()) {
      return 'admin';
    }
    return 'member';
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            
            // Fetch profile and permissions data
            const profileData = await fetchProfile(initialSession.user.id);
            setProfile(profileData);
            
            const permissionsData = await fetchPermissions(initialSession.user.id);
            setPermissions(permissionsData);
          }
          
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        console.log('Auth state change:', event, currentSession?.user?.id);

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
            
            const permissionsData = await fetchPermissions(currentSession.user.id);
            setPermissions(permissionsData);
          }, 0);
        } else {
          setProfile(null);
          setPermissions({});
        }

        if (!isInitialized) {
          setIsInitialized(true);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    isInitialized,
    hasUser: !!user,
    supabaseClient: supabase,
    permissions,
    signOut,
    logout,
    refreshProfile,
    refreshPermissions,
    login,
    signIn,
    signUp,
    isAdmin,
    isMember,
    getUserType,
    updatePassword,
    resetPassword,
    resetAuthSystem,
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

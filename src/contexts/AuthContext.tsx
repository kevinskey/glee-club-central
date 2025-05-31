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
  phone?: string;
  voice_part?: string;
  status?: string;
  is_super_admin?: boolean;
  dues_paid?: boolean;
  personal_title?: string;
  class_year?: string;
  join_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
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
  createFallbackProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cleanup utility functions
export const cleanupAuthState = () => {
  localStorage.removeItem('supabase.auth.token');
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
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

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      if (profileData) {
        console.log('Profile loaded successfully:', profileData);
        return profileData;
      }

      console.warn('No profile found for user:', userId);
      return null;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  const createFallbackProfile = async () => {
    if (!user) {
      console.warn('Cannot create fallback profile: no user available');
      return;
    }

    try {
      console.log('Creating fallback profile for user:', user.id);
      
      // Check if profile already exists
      const existingProfile = await fetchProfile(user.id);
      if (existingProfile) {
        setProfile(existingProfile);
        return;
      }

      // Create minimal profile - NOTE: No email field as it's not in the profiles table
      const fallbackProfile: Partial<Profile> = {
        id: user.id,
        first_name: user.user_metadata?.first_name || 'User',
        last_name: user.user_metadata?.last_name || '',
        role: 'member',
        status: 'active',
        is_super_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([fallbackProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating fallback profile:', error);
        // Set the fallback profile in state even if DB insert fails
        setProfile(fallbackProfile as Profile);
        toast.warning('Profile created locally. Some features may be limited.');
      } else {
        console.log('Fallback profile created successfully:', data);
        setProfile(data);
        toast.success('Profile created successfully');
      }
    } catch (error) {
      console.error('Error in createFallbackProfile:', error);
      // Create a minimal in-memory profile as last resort
      const memoryProfile: Profile = {
        id: user.id,
        first_name: user.user_metadata?.first_name || 'User',
        last_name: user.user_metadata?.last_name || '',
        role: 'member',
        status: 'active',
        is_super_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(memoryProfile);
      toast.error('Could not create profile in database. Using temporary profile.');
    }
  };

  const fetchPermissions = async (userId: string) => {
    try {
      console.log('Fetching permissions for user:', userId);
      const { data, error } = await supabase
        .rpc('get_user_permissions', { p_user_id: userId });
      
      if (error) {
        console.error('Error fetching permissions:', error);
        return {
          'view_sheet_music': true,
          'view_calendar': true,
          'view_announcements': true
        };
      }
      
      const permissionsMap: { [key: string]: boolean } = {};
      data?.forEach((perm: any) => {
        permissionsMap[perm.permission] = perm.granted;
      });
      
      console.log('Permissions loaded:', permissionsMap);
      return permissionsMap;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      };
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      console.log('Refreshing profile for user:', user.id);
      const profileData = await fetchProfile(user.id);
      
      if (profileData) {
        setProfile(profileData);
      } else {
        console.warn('Profile refresh failed, showing fallback creation option');
        toast.warning('Profile not found. Click to create a new profile.', {
          action: {
            label: 'Create Profile',
            onClick: createFallbackProfile
          },
          duration: 10000
        });
      }
    }
  };

  const refreshPermissions = async () => {
    if (user?.id) {
      console.log('Refreshing permissions for user:', user.id);
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
    // Primary check: profile-based admin status
    if (profile?.is_super_admin === true || profile?.role === 'admin') {
      console.log('Admin detected via profile:', { is_super_admin: profile.is_super_admin, role: profile.role });
      return true;
    }
    
    // Fallback: Check user metadata for known admin emails or roles
    if (user) {
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      const userType = user.user_metadata?.user_type || user.app_metadata?.user_type;
      
      if (userRole === 'admin' || userRole === 'super_admin' || userType === 'admin') {
        console.log('Admin detected via user metadata fallback:', { userRole, userType });
        return true;
      }
      
      // Check email-based admin detection for known admin emails
      const adminEmails = ['kevinskey@mac.com'];
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
    let initTimeout: NodeJS.Timeout;

    initTimeout = setTimeout(() => {
      if (mounted && !isInitialized) {
        console.log('Auth initialization timeout, setting as initialized');
        setIsLoading(false);
        setIsInitialized(true);
      }
    }, 3000);

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (mounted) {
          if (initialSession?.user) {
            console.log('Found existing session for user:', initialSession.user.id);
            setSession(initialSession);
            setUser(initialSession.user);
            
            try {
              const profileData = await fetchProfile(initialSession.user.id);
              if (mounted) {
                if (profileData) {
                  setProfile(profileData);
                } else {
                  console.warn('No profile found during initialization');
                  toast.warning('Profile missing. Some features may be limited.', {
                    action: {
                      label: 'Create Profile',
                      onClick: createFallbackProfile
                    },
                    duration: 8000
                  });
                }
              }
              
              const permissionsData = await fetchPermissions(initialSession.user.id);
              if (mounted) {
                setPermissions(permissionsData);
              }
            } catch (dataError) {
              console.error('Error loading user data:', dataError);
            }
          }
          
          setIsLoading(false);
          setIsInitialized(true);
          clearTimeout(initTimeout);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
          clearTimeout(initTimeout);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        console.log('Auth state change:', event, currentSession?.user?.id);

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(async () => {
            if (!mounted) return;
            
            const profileData = await fetchProfile(currentSession.user.id);
            if (mounted) {
              if (profileData) {
                setProfile(profileData);
              } else {
                console.warn('Profile not found after auth state change');
                setProfile(null);
              }
            }
            
            const permissionsData = await fetchPermissions(currentSession.user.id);
            if (mounted) {
              setPermissions(permissionsData);
            }
          }, 100);
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
      clearTimeout(initTimeout);
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
    signOut: async () => {
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
    },
    logout: async () => {
      try {
        await value.signOut();
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    refreshProfile,
    refreshPermissions,
    createFallbackProfile,
    login: async (email: string, password: string) => {
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
    },
    signIn: async (email: string, password: string) => {
      return value.login(email, password);
    },
    signUp: async (email: string, password: string, firstName: string, lastName: string, userType: string = 'member') => {
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
    },
    isAdmin,
    isMember,
    getUserType,
    updatePassword: async (newPassword: string) => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        return { error };
      } catch (error) {
        return { error };
      }
    },
    resetPassword: async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error };
      } catch (error) {
        return { error };
      }
    },
    resetAuthSystem: async () => {
      try {
        cleanupAuthState();
        await supabase.auth.signOut({ scope: 'global' });
        window.location.href = '/';
        return { success: true };
      } catch (error) {
        console.error('Error resetting auth system:', error);
        return { success: false };
      }
    },
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


import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any; data: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  isAdmin: () => boolean;
  isMember: () => boolean;
  getUserType: () => 'admin' | 'member';
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use the consolidated profile hook
  const { profile, refreshProfile: refreshUserProfile, updateProfile } = useUserProfile(user);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 AuthContext: Initializing auth state...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ AuthContext: Session error:', error);
        }

        if (mounted) {
          const sessionUser = session?.user;
          if (sessionUser) {
            const authUser: AuthUser = {
              id: sessionUser.id,
              email: sessionUser.email,
              email_confirmed_at: sessionUser.email_confirmed_at,
              created_at: sessionUser.created_at,
              updated_at: sessionUser.updated_at,
              user_metadata: sessionUser.user_metadata
            };
            setUser(authUser);
          } else {
            setUser(null);
          }
          
          setIsLoading(false);
          setIsInitialized(true);
          console.log('✅ AuthContext: Auth initialization complete');
        }
      } catch (error) {
        console.error('❌ AuthContext: Initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 AuthContext: Auth state change:', event, !!session);
      
      if (!mounted) return;

      const sessionUser = session?.user;
      if (sessionUser && event === 'SIGNED_IN') {
        const authUser: AuthUser = {
          id: sessionUser.id,
          email: sessionUser.email,
          email_confirmed_at: sessionUser.email_confirmed_at,
          created_at: sessionUser.created_at,
          updated_at: sessionUser.updated_at,
          user_metadata: sessionUser.user_metadata
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
      setIsInitialized(true);
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        console.error('❌ AuthContext: Login error:', error);
        return { error };
      }
      
      console.log('✅ AuthContext: Login successful');
      return { error: null };
    } catch (err) {
      console.error('💥 AuthContext: Unexpected login error:', err);
      return { error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 AuthContext: Logout attempt');
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('💥 AuthContext: Logout error:', err);
      return { error: err };
    }
  }, []);

  const signOut = logout; // Alias for compatibility

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('📝 AuthContext: Sign up attempt for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      return { error, data };
    } catch (err) {
      console.error('💥 AuthContext: Sign up error:', err);
      return { error: err, data: null };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const isAdmin = useCallback(() => {
    const isKnownAdmin = user?.email === 'kevinskey@mac.com';
    const profileAdmin = profile ? (profile.is_super_admin === true || profile.role === 'admin') : false;
    return isKnownAdmin || profileAdmin;
  }, [profile, user?.email]);

  const isMember = useCallback(() => {
    return !profile || profile.role === 'member' || !profile.role;
  }, [profile]);

  const getUserType = useCallback((): 'admin' | 'member' => {
    return isAdmin() ? 'admin' : 'member';
  }, [isAdmin]);

  const refreshProfile = useCallback(async () => {
    await refreshUserProfile();
  }, [refreshUserProfile]);

  const contextValue: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    login,
    logout,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
    isAdmin,
    isMember,
    getUserType,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

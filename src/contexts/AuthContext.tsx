import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile, AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/auth/useAuthState';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clean up problematic auth keys
export const cleanupAuthState = () => {
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.includes('sb-') && (key.includes('auth-token') || key.includes('refresh-token'))
  );
  keysToRemove.forEach(key => {
    console.log('🧹 Cleaning up auth key:', key);
    localStorage.removeItem(key);
  });
};

export const resetAuthSystem = async () => {
  try {
    console.log('🔄 Resetting auth system...');
    await supabase.auth.signOut();
    cleanupAuthState();
    return { success: true };
  } catch (error) {
    console.error('Error resetting auth system:', error);
    return { success: false };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading, isInitialized, permissions, refreshUserData } = useAuthState();
  const [session, setSession] = useState<any>(null);

  // Session tracking
  useEffect(() => {
    console.log('🔄 AuthContext: Setting up session listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Session change:', {
          event,
          hasSession: !!session,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });
        
        setSession(session);
      }
    );

    return () => {
      console.log('🔄 AuthContext: Cleaning up session listener');
      subscription.unsubscribe();
    };
  }, []);

  // Authentication status
  const isAuthenticated = !!user && !!session;

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Login attempt for:', email);
      
      // Clean up any existing problematic state first
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      console.log('🔐 AuthContext: Login response:', {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        error: error?.message
      });
      
      if (error) {
        console.error('❌ AuthContext: Login error:', error);
        return { error };
      }
      
      if (data.session && data.user) {
        console.log('✅ AuthContext: Login successful for user:', data.user.id);
        setSession(data.session);
        return { error: null };
      }
      
      console.warn('⚠️ AuthContext: Login completed but no session created');
      return { error: new Error('No session created') };
    } catch (err) {
      console.error('💥 AuthContext: Unexpected login error:', err);
      return { error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 AuthContext: Logout attempt');
      const { error } = await supabase.auth.signOut();
      console.log('🚪 AuthContext: Logout response:', { error: error?.message });
      
      if (!error) {
        setSession(null);
        cleanupAuthState();
        console.log('✅ AuthContext: Logout successful');
      }
      return { error };
    } catch (err) {
      console.error('💥 AuthContext: Logout error:', err);
      return { error: err };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string, userType: any = 'member') => {
    try {
      console.log('📝 AuthContext: Sign up attempt for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
          },
        },
      });
      
      console.log('📝 AuthContext: Sign up response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        error: error?.message
      });
      
      return { error, data };
    } catch (err) {
      console.error('💥 AuthContext: Sign up error:', err);
      return { error: err, data: null };
    }
  }, []);

  const isAdmin = useCallback(() => {
    const adminStatus = profile?.is_super_admin === true || profile?.role === 'admin';
    console.log('👑 AuthContext: Admin check:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      isSuperAdmin: profile?.is_super_admin,
      result: adminStatus
    });
    return adminStatus;
  }, [profile]);

  const isMember = useCallback(() => {
    const memberStatus = profile?.role === 'member' || !profile?.role;
    console.log('👤 AuthContext: Member check:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      result: memberStatus
    });
    return memberStatus;
  }, [profile]);

  const getUserType = useCallback(() => {
    const userType = (profile?.is_super_admin === true || profile?.role === 'admin') ? 'admin' : 'member';
    console.log('🏷️ AuthContext: User type:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      isSuperAdmin: profile?.is_super_admin,
      result: userType
    });
    return userType;
  }, [profile]);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }, []);

  const refreshPermissions = useCallback(async () => {
    if (user?.id) {
      await refreshUserData();
    }
  }, [user?.id, refreshUserData]);

  const createFallbackProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('🔧 AuthContext: Creating fallback profile for user:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || 'User',
          last_name: user.user_metadata?.last_name || '',
          role: 'member',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('❌ AuthContext: Error creating fallback profile:', error);
      } else {
        console.log('✅ AuthContext: Fallback profile created successfully');
        await refreshUserData();
      }
    } catch (error) {
      console.error('💥 AuthContext: Error creating fallback profile:', error);
    }
  }, [user, refreshUserData]);

  const contextValue: AuthContextType = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    isInitialized,
    session,
    supabaseClient: supabase,
    login,
    logout,
    signIn: login,
    signOut: logout,
    signUp,
    isAdmin,
    isMember,
    getUserType,
    updatePassword,
    resetPassword,
    permissions,
    refreshPermissions,
    resetAuthSystem: useCallback(async () => {
      return resetAuthSystem();
    }, []),
    createFallbackProfile,
    refreshUserData,
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

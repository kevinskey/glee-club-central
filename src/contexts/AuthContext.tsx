import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile, AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/auth/useAuthState';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simplified cleanup function - only clear specific problematic keys
export const cleanupAuthState = () => {
  // Only remove keys that might be causing conflicts
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.includes('sb-') && key.includes('auth-token')
  );
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

export const resetAuthSystem = async () => {
  try {
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

  // Enhanced debug logging for auth state
  useEffect(() => {
    console.log('🔍 AuthContext: AUTH STATE DEBUG:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userMetadata: user?.user_metadata,
      hasProfile: !!profile,
      profileId: profile?.id,
      profileRole: profile?.role,
      profileIsAdmin: profile?.is_super_admin,
      profileStatus: profile?.status,
      profileFirstName: profile?.first_name,
      profileLastName: profile?.last_name,
      isLoading,
      isInitialized,
      hasSession: !!session,
      sessionUserId: session?.user?.id,
      sessionUserEmail: session?.user?.email,
      permissions: Object.keys(permissions || {}),
      timestamp: new Date().toISOString()
    });

    // Additional profile-specific logging
    if (profile) {
      console.log('👤 AuthContext: PROFILE DETAILS:', {
        fullProfile: profile,
        profileKeys: Object.keys(profile),
        profileValues: Object.values(profile)
      });
    }

    // Auth.uid() check
    console.log('🔑 AuthContext: Current auth.uid():', {
      authUid: user?.id,
      profileMatchesAuth: profile?.id === user?.id
    });
  }, [user, profile, isLoading, isInitialized, session, permissions]);

  // Enhanced session tracking with detailed logging
  useEffect(() => {
    console.log('🔄 AuthContext: Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: AUTH STATE CHANGE EVENT:', {
          event,
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          userMetadata: session?.user?.user_metadata,
          expiresAt: session?.expires_at,
          accessToken: session?.access_token ? 'present' : 'missing',
          refreshToken: session?.refresh_token ? 'present' : 'missing',
          timestamp: new Date().toISOString()
        });
        
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ AuthContext: User signed in successfully:', {
            userId: session.user.id,
            email: session.user.email,
            metadata: session.user.user_metadata
          });

          // Try to fetch profile immediately after sign in
          try {
            console.log('📋 AuthContext: Attempting to fetch profile for user:', session.user.id);
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            console.log('📋 AuthContext: Profile fetch result:', {
              hasProfileData: !!profileData,
              profileData,
              profileError: profileError?.message,
              errorCode: profileError?.code,
              errorDetails: profileError?.details
            });
          } catch (err) {
            console.error('💥 AuthContext: Profile fetch error:', err);
          }
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('👋 AuthContext: User signed out, cleaning up');
          cleanupAuthState();
        }
      }
    );

    return () => {
      console.log('🔄 AuthContext: Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  // Authentication status - requires both user and session
  const isAuthenticated = !!user && !!session;

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: LOGIN ATTEMPT for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      console.log('🔐 AuthContext: LOGIN RESPONSE:', {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        userMetadata: data?.user?.user_metadata,
        sessionDetails: data?.session ? {
          accessToken: data.session.access_token ? 'present' : 'missing',
          refreshToken: data.session.refresh_token ? 'present' : 'missing',
          expiresAt: data.session.expires_at
        } : null,
        error: error?.message,
        errorCode: error?.code
      });
      
      if (error) {
        console.error('❌ AuthContext: Login error:', error);
        return { error };
      }
      
      if (data.session && data.user) {
        console.log('✅ AuthContext: Login successful, session created for user:', data.user.id);
        setSession(data.session);

        // Immediately try to verify profile access
        setTimeout(async () => {
          try {
            console.log('🔍 AuthContext: Post-login profile verification...');
            const { data: profileCheck, error: profileCheckError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            console.log('🔍 AuthContext: Post-login profile check:', {
              hasProfile: !!profileCheck,
              profileData: profileCheck,
              error: profileCheckError?.message
            });
          } catch (err) {
            console.error('💥 AuthContext: Post-login profile check failed:', err);
          }
        }, 1000);

        return { error: null };
      }
      
      console.warn('⚠️ AuthContext: Login completed but no session or user created');
      return { error: new Error('No session or user created') };
    } catch (err) {
      console.error('💥 AuthContext: Unexpected login error:', err);
      return { error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 AuthContext: LOGOUT ATTEMPT');
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

  const signIn = useCallback(async (email: string, password: string) => {
    return login(email, password);
  }, [login]);

  const signOut = useCallback(async () => {
    try {
      console.log('🚪 AuthContext: LOGOUT ATTEMPT');
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
      console.log('📝 AuthContext: SIGN UP ATTEMPT for:', email);
      
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
      
      console.log('📝 AuthContext: SIGN UP RESPONSE:', {
        hasData: !!data,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        error: error?.message,
        errorCode: error?.code
      });
      
      return { error, data };
    } catch (err) {
      console.error('💥 AuthContext: Sign up error:', err);
      return { error: err, data: null };
    }
  }, []);

  const isAdmin = useCallback(() => {
    // Ensure we have a profile before checking admin status
    if (!profile) {
      console.log('👑 AuthContext: ADMIN CHECK - no profile loaded yet');
      return false;
    }
    
    const adminStatus = profile?.is_super_admin === true || profile?.role === 'admin';
    console.log('👑 AuthContext: ADMIN CHECK RESULT:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      isSuperAdmin: profile?.is_super_admin,
      isAdmin: adminStatus,
      userId: user?.id,
      profileId: profile?.id
    });
    return adminStatus;
  }, [profile, user]);

  const isMember = useCallback(() => {
    if (!profile) {
      console.log('👤 AuthContext: MEMBER CHECK - no profile loaded yet');
      return false;
    }
    
    const memberStatus = profile?.role === 'member' || !profile?.role;
    console.log('👤 AuthContext: MEMBER CHECK RESULT:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      isMember: memberStatus,
      userId: user?.id,
      profileId: profile?.id
    });
    return memberStatus;
  }, [profile, user]);

  const getUserType = useCallback(() => {
    if (!profile) {
      console.log('🏷️ AuthContext: USER TYPE CHECK - no profile loaded yet, defaulting to member');
      return 'member'; // Default to member while loading
    }
    
    const userType = (profile?.is_super_admin === true || profile?.role === 'admin') ? 'admin' : 'member';
    console.log('🏷️ AuthContext: USER TYPE CHECK RESULT:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      isSuperAdmin: profile?.is_super_admin,
      userType,
      userId: user?.id,
      profileId: profile?.id
    });
    return userType;
  }, [profile, user]);

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

  const resetAuthSystemCallback = useCallback(async () => {
    return resetAuthSystem();
  }, []);

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
      
      console.log('🔧 AuthContext: Fallback profile creation result:', { error: error?.message });
      
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
    logout: useCallback(async () => {
      try {
        console.log('🚪 AuthContext: LOGOUT ATTEMPT');
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
    }, []),
    signIn: useCallback(async (email: string, password: string) => {
      return login(email, password);
    }, [login]),
    signOut: useCallback(async () => {
      try {
        console.log('🚪 AuthContext: LOGOUT ATTEMPT');
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
    }, []),
    signUp: useCallback(async (email: string, password: string, firstName: string, lastName: string, userType: any = 'member') => {
      try {
        console.log('📝 AuthContext: SIGN UP ATTEMPT for:', email);
        
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
        
        console.log('📝 AuthContext: SIGN UP RESPONSE:', {
          hasData: !!data,
          hasUser: !!data?.user,
          userId: data?.user?.id,
          userEmail: data?.user?.email,
          error: error?.message,
          errorCode: error?.code
        });
        
        return { error, data };
      } catch (err) {
        console.error('💥 AuthContext: Sign up error:', err);
        return { error: err, data: null };
      }
    }, []),
    isAdmin,
    isMember,
    getUserType,
    updatePassword: useCallback(async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error };
    }, []),
    resetPassword: useCallback(async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    }, []),
    permissions,
    refreshPermissions: useCallback(async () => {
      if (user?.id) {
        await refreshUserData();
      }
    }, [user?.id, refreshUserData]),
    resetAuthSystem: useCallback(async () => {
      return resetAuthSystem();
    }, []),
    createFallbackProfile: useCallback(async () => {
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
        
        console.log('🔧 AuthContext: Fallback profile creation result:', { error: error?.message });
        
        if (error) {
          console.error('❌ AuthContext: Error creating fallback profile:', error);
        } else {
          console.log('✅ AuthContext: Fallback profile created successfully');
          await refreshUserData();
        }
      } catch (error) {
        console.error('💥 AuthContext: Error creating fallback profile:', error);
      }
    }, [user, refreshUserData]),
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

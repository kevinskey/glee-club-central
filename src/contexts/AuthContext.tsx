
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthContextType, Profile, UserType } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Helper function to convert Supabase User to AuthUser
const mapUserToAuthUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
    app_metadata: user.app_metadata,
    aud: user.aud,
    created_at: user.created_at
  };
};

// Create a context with a more complete type definition that includes all required properties
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any>(null);
  
  // Function to fetch the user profile from Supabase
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      if (data) {
        // If user_type is not set, infer it from is_super_admin or role
        if (!data.user_type) {
          if (data.is_super_admin) {
            data.user_type = 'admin';
          } else if (data.role === 'admin') {
            data.user_type = 'admin';
          } else if (data.role === 'member') {
            data.user_type = 'member';
          } else {
            data.user_type = 'fan';
          }
        }
        
        setProfile(data);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  }, []);
  
  // Initialize auth state
  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ? mapUserToAuthUser(currentSession.user) : null);
        setIsAuthenticated(!!currentSession);
        
        // Defer profile fetching to avoid potential race conditions
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ? mapUserToAuthUser(currentSession.user) : null);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("Error fetching auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Function to refresh user permissions and profile data
  const refreshPermissions = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const updatedProfile = await fetchUserProfile(user.id);
      if (updatedProfile) {
        console.log("Profile refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing permissions:", error);
    }
  }, [user?.id, fetchUserProfile]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setUser(data.user ? mapUserToAuthUser(data.user) : null);
      setSession(data.session);
      setIsAuthenticated(true);
      
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    return login(email, password);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAuthenticated(false);
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    return logout();
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, userType: UserType = 'fan') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
            user_type: userType
          }
        }
      });
      
      if (error) throw error;
      
      return { error: null, data };
    } catch (error) {
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    return profile?.is_super_admin === true || profile?.user_type === 'admin';
  };

  const isMember = () => {
    return profile?.user_type === 'member';
  };

  const isFan = () => {
    return profile?.user_type === 'fan';
  };

  const getUserType = (): UserType | null => {
    return profile?.user_type || null;
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    profile,
    session,
    
    login,
    logout,
    signIn,
    signOut,
    signUp,
    isAdmin,
    isMember,
    isFan,
    getUserType,
    updatePassword,
    resetPassword,
    refreshPermissions,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

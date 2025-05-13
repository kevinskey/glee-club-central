
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthContextType, Profile, UserRole } from '@/types/auth';
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
    role: (user.app_metadata?.role || 'member') as UserRole,
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
  
  // Initialize auth state
  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ? mapUserToAuthUser(currentSession.user) : null);
        setIsAuthenticated(!!currentSession);
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
  }, []);

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
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    return logout();
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role?: string) => {
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
            role: role || 'member'
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

  const refreshPermissions = async (userId?: string) => {
    console.log('Refreshing permissions for user:', userId || user?.id);
    // In a real implementation, would fetch permissions from backend
  };

  const isAdmin = () => {
    return profile?.role === 'admin' || profile?.role === 'administrator' || profile?.is_super_admin === true;
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

  const userPermissions = {
    can_manage_users: isAdmin(),
    can_post_announcements: true,
    can_manage_archives: isAdmin(),
    can_edit_financials: isAdmin(),
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    profile,
    permissions: userPermissions,
    session,
    
    login,
    logout,
    signIn,
    signOut,
    signUp,
    refreshPermissions,
    isAdmin,
    updatePassword,
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

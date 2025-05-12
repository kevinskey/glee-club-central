
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthContextType, Profile, UserRole } from '@/types/auth';

// Create a context with a more complete type definition that includes all required properties
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // For development purposes
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>({
    id: '1',
    email: 'demo@example.com',
    user_metadata: {
      full_name: 'Demo User',
      avatar_url: '',
    },
    role: 'admin',
  });
  
  const [profile, setProfile] = useState<Profile | null>({
    id: '1',
    first_name: 'Demo',
    last_name: 'User',
    email: 'demo@example.com',
    role: 'admin',
    title: 'Administrator',
    is_super_admin: true,
  });

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
      setUser({
        id: '1',
        email,
        user_metadata: {
          full_name: 'Demo User',
          avatar_url: '',
        },
        role: 'admin',
      });
      setProfile({
        id: '1',
        first_name: 'Demo',
        last_name: 'User',
        email,
        role: 'admin',
        title: 'Administrator',
        is_super_admin: true,
      });
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
    // Mock logout
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  const signOut = async () => {
    return logout();
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role?: string) => {
    setIsLoading(true);
    try {
      // Mock signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = {
        id: '2',
        email,
        user_metadata: {
          full_name: `${firstName} ${lastName}`,
          avatar_url: '',
        },
        role: role || 'member',
      };
      const newProfile = {
        id: '2',
        first_name: firstName,
        last_name: lastName,
        email,
        role: role || 'member',
        title: role || 'Member',
      };
      // For real implementation, would create user here
      console.log('Created user:', newUser);
      console.log('Created profile:', newProfile);
      return { error: null, data: { user: newUser } };
    } catch (error) {
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPermissions = async (userId?: string) => {
    console.log('Refreshing permissions for user:', userId || user?.id);
    // Mock implementation - would fetch permissions from backend in real implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    // No state changes needed for this mock implementation
  };

  const isAdmin = () => {
    return profile?.role === 'admin' || profile?.role === 'administrator' || profile?.is_super_admin === true;
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    profile,
    permissions: {
      can_manage_users: true,
      can_post_announcements: true,
      can_manage_archives: true,
      can_edit_financials: true,
    },
    login,
    logout,
    signIn,
    signOut,
    signUp,
    refreshPermissions,
    isAdmin,
    updatePassword: async () => ({ error: null }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // For development purposes
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<any | null>({
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'admin'
  });

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
    setProfile({
      id: '1',
      email,
      name: 'Demo User',
      role: 'admin'
    });
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    // Mock logout
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAuthenticated(false);
    setProfile(null);
    setIsLoading(false);
  };

  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  const value = {
    isAuthenticated,
    isLoading,
    profile,
    login,
    logout,
    isAdmin
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

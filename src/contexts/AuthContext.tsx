
import * as React from 'react';
import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react';
import { AuthUser, AuthContextType, Profile, UserType } from '@/types/auth';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { useLoadingCoordinator } from '@/hooks/useLoadingCoordinator';

// Create a properly initialized AuthContext with null as default
const AuthContext = React.createContext<AuthContextType | null>(null);

// Enhanced cleanup function that thoroughly removes all auth state
export const cleanupAuthState = () => {
  console.log("Cleaning up auth state completely");
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log("Removing localStorage key:", key);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log("Removing sessionStorage key:", key);
      sessionStorage.removeItem(key);
    }
  });
  
  // Clear any redirect paths
  sessionStorage.removeItem('authRedirectPath');
  sessionStorage.removeItem('authRedirectTimestamp');
  sessionStorage.removeItem('authRedirectIntent');
  
  // Clear any other app-specific auth data
  localStorage.removeItem('lastAuthUser');
  localStorage.removeItem('userRole');

  // Clear cookies that might be related to auth
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
};

// Function to completely reset the auth system
export const resetAuthSystem = async () => {
  try {
    // Try global sign out first (cleans up on server side)
    await supabase.auth.signOut({ scope: 'global' });
    console.log("Successfully performed global sign out");
  } catch (error) {
    console.error("Error during global sign out:", error);
    // Continue with local cleanup even if global signout fails
  }
  
  // Clean up local storage
  cleanupAuthState();
  
  // Force page reload to ensure clean state
  window.location.href = '/login';
  
  return { success: true };
};

interface AuthProviderProps {
  children: React.ReactNode | ((props: { isLoading: boolean }) => React.ReactNode);
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Use the optimized auth state hook
  const { user: authUser, profile, isLoading, isInitialized, permissions, refreshUserData } = useAuthState();
  const { setLoading } = useLoadingCoordinator();
  
  // Legacy hooks for compatibility
  const session = useSession();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  // Update loading coordinator when auth state changes
  React.useEffect(() => {
    setLoading('auth', isLoading);
  }, [isLoading, setLoading]);

  React.useEffect(() => {
    setLoading('profile', !profile);
  }, [profile, setLoading]);
  
  // User role and type helper functions - memoized to prevent re-renders
  const isAdmin = React.useCallback(() => {
    return !!(profile?.is_super_admin || profile?.role === 'admin');
  }, [profile?.is_super_admin, profile?.role]);
  
  const isMember = React.useCallback(() => {
    return profile?.role === 'member' || (!profile?.is_super_admin && profile?.role !== 'admin');
  }, [profile?.role, profile?.is_super_admin]);
  
  // getUserType function defined in the provider - memoized
  const getUserType = React.useCallback((): UserType => {
    const userType = profile?.user_type || '';
    
    // If user_type doesn't exist, infer from role
    if (!userType && profile) {
      if (profile.is_super_admin || profile.role === 'admin') {
        return 'admin';
      } else {
        return 'member';
      }
    }
    
    return userType as UserType;
  }, [profile]);

  // Auth methods using window.location for navigation instead of router hooks
  const handleLogout = React.useCallback(async () => {
    try {
      console.log("Executing logout process");
      
      // Clean up auth state first
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      }
      
      // Use window.location for navigation to ensure full page refresh
      window.location.href = '/login';
      
      return { error: error as Error, data: {} };
    } catch (err) {
      console.error("Error during logout:", err);
      toast.error("An unexpected error occurred during logout");
      return { error: err as Error, data: {} };
    }
  }, []);
  
  // Enhanced login function with better logging and error handling
  const defaultLogin = React.useCallback(async (email: string, password: string) => {
    console.log("Login attempt with email:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      console.log("Login response:", { hasData: !!data, hasUser: !!data?.user, hasError: !!error });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message || "Login failed");
        return { error, data: null };
      }
      
      if (data && data.user) {
        console.log("Login successful for user:", data.user.id);
        toast.success("Login successful!");
        
        // Try to load return URL from storage
        const returnTo = sessionStorage.getItem('authRedirectPath') || '/role-dashboard';
        const intent = sessionStorage.getItem('authRedirectIntent');
        
        console.log("Will redirect to:", { returnTo, intent });
        
        return { error: null, data, returnTo, intent };
      } else {
        console.error("Login returned no user data");
        toast.error("Login failed - no user data returned");
        return { error: new Error("No user data returned"), data: null };
      }
    } catch (err: any) {
      console.error("Unexpected error during login:", err);
      toast.error(err.message || "An unexpected error occurred during login");
      return { error: err, data: null };
    }
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const value = React.useMemo((): AuthContextType => ({
    user: authUser,
    profile,
    session,
    supabaseClient,
    isAuthenticated: !!authUser && isInitialized,
    isLoading: isLoading || !isInitialized,
    login: defaultLogin,
    logout: handleLogout,
    signIn: defaultLogin,
    signOut: handleLogout,
    signUp: async (email: string, password: string, firstName: string, lastName: string, userType: UserType = 'member') => {
      console.log("Signup attempt for:", email);
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              avatar_url: '',
              user_type: userType,
            },
          },
        });
        
        console.log("Signup response:", { hasData: !!data, hasUser: !!data?.user, hasError: !!error });
        
        if (error) {
          console.error("Signup error:", error.message);
          toast.error(error.message || "Signup failed");
        } else if (data && data.user) {
          console.log("Signup successful for user:", data.user.id);
          toast.success("Signup successful!");
        }
        
        return { error, data };
      } catch (err: any) {
        console.error("Unexpected error during signup:", err);
        toast.error(err.message || "An unexpected error occurred during signup");
        return { error: err, data: null };
      }
    },
    isAdmin,
    isMember,
    getUserType,
    updatePassword: async (newPassword: string) => {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
      }
      return { error };
    },
    resetPassword: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) {
        toast.error(error.message);
      }
      return { error };
    },
    permissions,
    refreshPermissions: refreshUserData,
    resetAuthSystem,
  }), [authUser, profile, session, supabaseClient, isInitialized, isLoading, defaultLogin, handleLogout, isAdmin, isMember, getUserType, permissions, refreshUserData]);
  
  console.log("Rendering AuthProvider with value:", { 
    isAuthenticated: value.isAuthenticated,
    isLoading: value.isLoading,
    hasUser: !!value.user,
    isInitialized
  });
  
  // Render children with context value
  return (
    <AuthContext.Provider value={value}>
      {typeof children === 'function' ? children({ isLoading: value.isLoading }) : children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

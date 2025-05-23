
import * as React from 'react';
import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react';
import { AuthUser, AuthContextType, Profile, UserType } from '@/types/auth';
import { toast } from "sonner";
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { getProfile } from '@/utils/supabase/profiles';
import { supabase } from '@/integrations/supabase/client';

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
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [permissions, setPermissions] = React.useState<{ [key: string]: boolean }>({});
  
  // These hooks can only be used inside a component that is a child of the SessionContextProvider
  const session = useSession();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  // Function to refresh user permissions
  const refreshPermissions = React.useCallback(async () => {
    if (profile && profile.id) {
      try {
        const userPermissions = await fetchUserPermissions(profile.id);
        setPermissions(userPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }
  }, [profile]);
  
  // Add a pre-check to detect if we have a session before even loading
  React.useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("Pre-check found existing session:", data.session.user.id);
        } else {
          console.log("No existing session found in pre-check");
        }
      } catch (err) {
        console.error("Error checking existing session:", err);
      }
    };

    checkExistingSession();
  }, []);
  
  React.useEffect(() => {
    console.log("AuthProvider useEffect - checking user:", user);
    
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        if (user) {
          console.log("User found, fetching profile:", user.id);
          // Type-safe conversion from User to AuthUser
          const authUserData: AuthUser = {
            id: user.id,
            email: user.email || '',
            app_metadata: user.app_metadata,
            user_metadata: user.user_metadata,
            aud: user.aud,
            created_at: user.created_at
          };
          
          setAuthUser(authUserData);
          
          // Fetch profile from Supabase
          const fetchedProfile = await getProfile(user.id);
            
          if (!fetchedProfile) {
            console.log('No profile found, creating default profile');
            // Create a default profile if one doesn't exist
            const { data: newProfile, error: profileError } = await supabaseClient
              .from('profiles')
              .insert([{
                id: user.id,
                first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || 'New',
                last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ')[1] || 'User',
                email: user.email,
                avatar_url: user.user_metadata?.avatar_url || '',
                user_type: user.user_metadata?.user_type || 'fan',
              }])
              .select('*')
              .single();
            
            if (profileError) {
              console.error('Error creating default profile:', profileError);
              toast.error('Error creating default profile');
            } else if (newProfile) {
              setProfile(newProfile as unknown as Profile);
              await refreshPermissions();
            }
          } else {
            setProfile(fetchedProfile);
            await refreshPermissions();
          }
        } else {
          console.log("No user found in session");
          setAuthUser(null);
          setProfile(null);
          setPermissions({});
        }
      } catch (error) {
        console.error("Unexpected error fetching or creating profile:", error);
        toast.error("Unexpected error fetching profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up an auth state change listener that runs before fetchProfile
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Only update immediately for sign in/out events
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          fetchProfile();
        }
      }
    );
    
    // Initial fetch to handle page loads
    fetchProfile();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, supabaseClient, refreshPermissions]);
  
  // User role and type helper functions
  const isAdmin = React.useCallback(() => {
    return !!(profile?.is_super_admin || profile?.role === 'admin');
  }, [profile]);
  
  const isMember = React.useCallback(() => {
    return profile?.role === 'member';
  }, [profile]);
  
  const isFan = React.useCallback(() => {
    return profile?.user_type === 'fan';
  }, [profile]);
  
  // getUserType function defined in the provider
  const getUserType = React.useCallback((): UserType => {
    const userType = profile?.user_type || '';
    
    // If user_type doesn't exist, infer from role
    if (!userType && profile) {
      if (profile.is_super_admin || profile.role === 'admin') {
        return 'admin';
      } else if (profile.role === 'member') {
        return 'member';
      } else {
        return 'fan';
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
      
      // Clear all local state
      setProfile(null);
      setAuthUser(null);
      setPermissions({});
      
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
  
  const value: AuthContextType = {
    user: authUser,
    profile,
    session,
    supabaseClient,
    isAuthenticated: !!user,
    isLoading,
    login: defaultLogin,
    logout: handleLogout,
    signIn: defaultLogin,
    signOut: handleLogout,
    signUp: async (email: string, password: string, firstName: string, lastName: string, userType: UserType = 'fan') => {
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
    isFan,
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
    refreshPermissions,
    resetAuthSystem, // Add the new reset function to the context
  };
  
  console.log("Rendering AuthProvider with value:", { 
    isAuthenticated: value.isAuthenticated,
    isLoading: value.isLoading,
    hasUser: !!value.user
  });
  
  // Render children with context value
  return (
    <AuthContext.Provider value={value}>
      {typeof children === 'function' ? children({ isLoading }) : children}
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

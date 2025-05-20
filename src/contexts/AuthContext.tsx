import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react';
import { AuthUser, AuthContextType, Profile, UserType } from '@/types/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { getProfile } from '@/utils/supabase/profiles';
import { supabase } from '@/integrations/supabase/client';

// Create a properly initialized AuthContext with null as default
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode | ((props: { isLoading: boolean }) => React.ReactNode);
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Use React hooks for state management
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  
  // These hooks must be used inside a component that is a child of the SessionContextProvider
  const session = useSession();
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  
  // Get router hooks - IMPORTANT: Now we're safely using these hooks inside a component 
  // that's properly wrapped by RouterProvider
  const navigate = useNavigate();
  const location = useLocation();
  
  // Function to refresh user permissions
  const refreshPermissions = useCallback(async () => {
    if (profile && profile.id) {
      try {
        const userPermissions = await fetchUserPermissions(profile.id);
        setPermissions(userPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }
  }, [profile]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        if (user) {
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
    
    fetchProfile();
  }, [user, supabaseClient, refreshPermissions]);
  
  // User role and type helper functions
  const isAdmin = useCallback(() => {
    return !!(profile?.is_super_admin || profile?.role === 'admin');
  }, [profile]);
  
  const isMember = useCallback(() => {
    return profile?.role === 'member';
  }, [profile]);
  
  const isFan = useCallback(() => {
    return profile?.user_type === 'fan';
  }, [profile]);
  
  // getUserType function defined in the provider
  const getUserType = useCallback((): UserType => {
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

  // Auth methods that use navigate must be inside the Router context
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    }
    setProfile(null);
    setAuthUser(null);
    setPermissions({});
    navigate('/');
    return { error };
  };
  
  const value: AuthContextType = {
    user: authUser,
    profile,
    session,
    supabaseClient,
    isAuthenticated: !!user,
    isLoading,
    login: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      }
      return { error };
    },
    logout: handleLogout,
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      }
      return { error };
    },
    signOut: handleLogout,
    signUp: async (email: string, password: string, firstName: string, lastName: string, userType: UserType = 'fan') => {
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
      
      if (error) {
        toast.error(error.message);
      }
      
      return { error, data };
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
  };
  
  // Render children with context value
  return (
    <AuthContext.Provider value={value}>
      {typeof children === 'function' ? children({ isLoading }) : children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

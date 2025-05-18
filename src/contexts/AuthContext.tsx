
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react';
import { AuthUser, AuthContextType, Profile, UserType } from '@/types/auth';
import { useNavigate } from 'react-router-dom'; // Replace next/navigation with react-router-dom
import { toast } from "sonner";
import { fetchUserPermissions } from '@/utils/supabase/permissions'; // Use correct function name

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  const session = useSession();
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const navigate = useNavigate(); // Use navigate instead of router
  
  // Function to refresh user permissions
  const refreshPermissions = useCallback(async () => {
    if (profile && profile.id) {
      const userPermissions = await fetchUserPermissions(profile.id);
      setPermissions(userPermissions);
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
          const { data: fetchedProfile, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
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
              setProfile(newProfile);
              await refreshPermissions();
            }
          } else if (fetchedProfile) {
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
  
  const login = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    }
    return { error };
  };
  
  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      toast.error(error.message);
    }
    setProfile(null);
    setAuthUser(null);
    setPermissions({});
    navigate('/'); // Use navigate instead of router.push
    return { error };
  };
  
  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    }
    return { error };
  };
  
  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      toast.error(error.message);
    }
    setProfile(null);
    setAuthUser(null);
    setPermissions({});
    navigate('/'); // Use navigate instead of router.push
    return { error };
  };
  
  const signUp = async (email: string, password: string, firstName: string, lastName: string, userType: UserType = 'fan') => {
    const { data, error } = await supabaseClient.auth.signUp({
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
  };
  
  const isAdmin = () => {
    return !!(profile?.is_super_admin || profile?.role === 'admin');
  };
  
  const isMember = () => {
    return profile?.role === 'member';
  };
  
  const isFan = () => {
    return profile?.user_type === 'fan';
  };
  
  // Define getUserType function here, not just in useAuth hook
  const getUserType = (): UserType => {
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
  };
  
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabaseClient.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    }
    return { error };
  };
  
  const resetPassword = async (email: string) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) {
      toast.error(error.message);
    }
    return { error };
  };
  
  const value = {
    user: authUser,
    profile,
    session,
    supabaseClient,
    isAuthenticated: !!user,
    isLoading,
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
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context; // We now return the complete context with getUserType function
};

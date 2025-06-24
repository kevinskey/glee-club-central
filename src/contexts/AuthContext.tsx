
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isAdminEmail } from "@/config/authConfig";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  role_tags?: string[];
  is_super_admin?: boolean;
  ecommerce_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  isAdmin: () => boolean;
  isMember: () => boolean;
  getUserType: () => string;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Simplified profile fetching
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }

      if (!data) {
        console.log('🔧 No profile found, creating fallback...');
        // Create a basic profile if none exists
        const fallbackProfile: Profile = {
          id: userId,
          first_name: 'User',
          last_name: '',
          role: isAdminEmail(user?.email) ? 'admin' : 'member',
          is_super_admin: isAdminEmail(user?.email),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return fallbackProfile;
      }

      console.log('✅ Profile fetched successfully:', data);
      return data;
    } catch (err) {
      console.error('💥 Error in fetchProfile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('🔄 Refreshing profile for user:', user.id);
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const isAdmin = () => {
    if (!user) return false;
    if (isAdminEmail(user.email)) return true;
    if (!profile) return false;
    return profile.is_super_admin === true || profile.role === 'admin';
  };

  const isMember = () => {
    return !!user && !!profile;
  };

  const getUserType = () => {
    if (!user || !profile) return 'guest';
    if (isAdmin()) return 'admin';
    return profile.role || 'member';
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Login error:', error);
        return { error };
      }

      console.log('✅ Login successful');
      // Don't set state here - let the auth state change handler do it
      return { error: null };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        return { error };
      }

      console.log('✅ Signup successful');
      return { error: null };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      setIsLoading(true);
      
      // Clear state immediately
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error signing out:', error);
        toast.error('Error signing out');
      } else {
        console.log('✅ Successfully signed out');
        toast.success('Successfully signed out');
      }
      
      // Force reload to clear any remaining state
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      
    } catch (error) {
      console.error('💥 Error signing out:', error);
      toast.error('Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = signOut; // Alias for consistency

  useEffect(() => {
    console.log('🚀 AuthProvider: Initializing...');
    
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Get initial session first
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
        } else if (initialSession?.user && mounted) {
          console.log('📱 Initial session found:', initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch profile
          const profileData = await fetchProfile(initialSession.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
        
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        
        console.log('🔔 Auth state change:', event, {
          hasSession: !!session,
          userEmail: session?.user?.email
        });
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          setUser(session.user);
          
          // Fetch profile after a short delay to avoid potential conflicts
          setTimeout(async () => {
            if (mounted) {
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
                setIsLoading(false);
              }
            }
          }, 100);
          
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 Token refreshed');
          setSession(session);
          // Don't refetch profile on token refresh, just update session
        }
      }
    );

    // Initialize auth state
    initializeAuth();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isInitialized,
    isAuthenticated: !!user && !!session,
    signOut,
    logout,
    login,
    signUp,
    resetPassword,
    updatePassword,
    isAdmin,
    isMember,
    getUserType,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

// Create context with undefined as default to ensure proper error handling
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper: Fetch or create the profile for a given user
  const ensureUserProfile = async (userObj: User) => {
    try {
      console.log('🔍 ensureUserProfile: Fetching profile for user:', userObj.id);
      
      // Try to fetch existing profile first
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userObj.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        // Continue to create profile even if fetch fails
      }

      if (profile) {
        console.log('✅ Profile found:', profile);
        return profile;
      }

      console.log('🔧 No profile found, creating new profile...');
      
      // No profile: create one. Only insert real columns!
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userObj.id,
            first_name: userObj.user_metadata?.first_name || userObj.email?.split('@')[0] || 'User',
            last_name: userObj.user_metadata?.last_name || '',
            role: userObj.email === 'kevinskey@mac.com' ? 'admin' : 'member',
            is_super_admin: userObj.email === 'kevinskey@mac.com',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('❌ Error creating profile:', insertError);
        
        // Return a fallback profile if creation fails
        const fallbackProfile = {
          id: userObj.id,
          first_name: userObj.user_metadata?.first_name || userObj.email?.split('@')[0] || 'User',
          last_name: userObj.user_metadata?.last_name || '',
          role: userObj.email === 'kevinskey@mac.com' ? 'admin' : 'member',
          is_super_admin: userObj.email === 'kevinskey@mac.com',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        console.log('🆘 Using fallback profile:', fallbackProfile);
        return fallbackProfile;
      }
      
      console.log('✅ Profile created successfully:', insertedProfile);
      return insertedProfile;
    } catch (err) {
      console.error('💥 Error in ensureUserProfile:', err);
      
      // Emergency fallback profile
      const emergencyProfile = {
        id: userObj.id,
        first_name: userObj.email?.split('@')[0] || 'User',
        last_name: '',
        role: userObj.email === 'kevinskey@mac.com' ? 'admin' : 'member',
        is_super_admin: userObj.email === 'kevinskey@mac.com',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('🆘 Using emergency fallback profile:', emergencyProfile);
      return emergencyProfile;
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      console.log('📡 fetchProfile: Fetching profile for user:', userId);
      
      // Use maybeSingle and only existing columns
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }

      console.log('✅ Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error in fetchProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('🔄 Refreshing profile for user:', user.id);
      // Always ensure a profile exists (create if missing)
      const profileData = await ensureUserProfile(user);
      setProfile(profileData);
    }
  };

  const isAdmin = () => {
    if (!user || !profile) return false;
    
    // Known admin email override
    if (user.email === 'kevinskey@mac.com') {
      return true;
    }
    
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
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error) {
        // Profile will be fetched via auth state change
        console.log('✅ Login successful');
      }
      
      return { error };
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

      if (!error) {
        console.log('✅ Signup successful');
      }
      
      return { error };
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
      setIsLoading(true);
      
      // Clear state first
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Clear localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = signOut; // Alias for consistency

  useEffect(() => {
    console.log('🔐 AuthManager: Initializing auth manager');
    
    let mounted = true;
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        // Set up auth listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event: AuthChangeEvent, session: Session | null) => {
            if (!mounted) return;
            
            console.log('🔐 Auth state change:', event, { 
              hasSession: !!session,
              userEmail: session?.user?.email 
            });
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Defer profile fetching to avoid deadlocks
              setTimeout(async () => {
                if (mounted) {
                  console.log('📡 Fetching profile after auth change...');
                  const profileData = await ensureUserProfile(session.user);
                  if (mounted) {
                    setProfile(profileData);
                    setIsLoading(false);
                  }
                }
              }, 100);
            } else {
              setProfile(null);
              if (mounted) {
                setIsLoading(false);
              }
            }
          }
        );

        // Then get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
        }
        
        if (mounted) {
          console.log('🔐 AuthManager: Session check completed', {
            hasSession: !!initialSession,
            userEmail: initialSession?.user?.email
          });
          
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);

            // Fetch or create profile for session user
            const profileData = await ensureUserProfile(initialSession.user);
            if (mounted) {
              setProfile(profileData);
            }
          }
          
          setIsInitialized(true);
          setIsLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();

    return () => {
      mounted = false;
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
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

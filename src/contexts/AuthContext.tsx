
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any, data: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthContext: Initializing auth state...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ AuthContext: Session error:', error);
        } else if (session?.user) {
          console.log('✅ AuthContext: Found existing session for:', session.user.id);
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            app_metadata: session.user.app_metadata,
            user_metadata: session.user.user_metadata,
            aud: session.user.aud,
            created_at: session.user.created_at
          };
          setUser(authUser);
        } else {
          console.log('ℹ️ AuthContext: No existing session found');
        }
      } catch (error) {
        console.error('💥 AuthContext: Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 AuthContext: Auth state change:', {
          event,
          hasSession: !!session,
          userId: session?.user?.id
        });

        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            app_metadata: session.user.app_metadata,
            user_metadata: session.user.user_metadata,
            aud: session.user.aud,
            created_at: session.user.created_at
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      console.log('🔄 AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        console.error('❌ AuthContext: Login error:', error);
        return { error };
      }
      
      console.log('✅ AuthContext: Login successful for user:', data.user?.id);
      return { error: null };
    } catch (err) {
      console.error('💥 AuthContext: Unexpected login error:', err);
      return { error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 AuthContext: Logout attempt');
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        console.log('✅ AuthContext: Logout successful');
      }
      return { error };
    } catch (err) {
      console.error('💥 AuthContext: Logout error:', err);
      return { error: err };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('📝 AuthContext: Sign up attempt for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      console.log('📝 AuthContext: Sign up response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        error: error?.message
      });
      
      return { error, data };
    } catch (err) {
      console.error('💥 AuthContext: Sign up error:', err);
      return { error: err, data: null };
    }
  }, []);

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    signUp,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

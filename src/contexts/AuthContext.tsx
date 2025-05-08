
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { PermissionSet, getUserPermissions } from "@/utils/supabase/user/types";
import type { AuthContextType, AuthUser, Profile } from "@/types/auth";
import { toast } from "sonner";

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<PermissionSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // On component mount, check for auth state
    async function checkSession() {
      setLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking auth session:", error);
        setLoading(false);
        return;
      }

      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }

    checkSession();

    // Subscribe to authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
          setPermissions(null);
        }
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: userId,
          email: session?.user?.email || "",
          role: data.role as AuthUser['role'], // Ensure type safety
        });

        setUserProfile(data as Profile);
        
        // Set permissions based on the role
        setPermissions(getUserPermissions(data.role));
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error("Error during sign in:", error.message);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return { error, data: null };
      }

      // Show welcome toast
      toast.success(`Welcome ${firstName}! Your account is being set up.`);

      return { error: null, data };
    } catch (error: any) {
      console.error("Error during sign up:", error.message);
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      console.error("Error during sign out:", error.message);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    if (!user) return false;
    return user.role === "administrator";
  };

  // Check if user has specific permission
  const hasPermission = (permission: string) => {
    if (!permissions) return false;
    return (permissions as any)[permission] === true;
  };

  // Value object for the context provider
  const value: AuthContextType = {
    user,
    userProfile,
    permissions,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
    profile: userProfile,
    signIn,
    signUp,
    signOut,
    isAdmin,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Type exports
export type { AuthContextType };
export type { Profile };

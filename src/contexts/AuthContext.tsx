
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AuthUser, Profile } from "@/types/auth";
import { toast } from "sonner";

// Define the AuthContextType interface
export interface AuthContextType {
  user: AuthUser | null;
  userProfile: Profile | null;
  permissions: PermissionSet | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

// Define permissions type here since we removed the imported one
interface PermissionSet {
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canEditMusic: boolean;
  canUploadMusic: boolean;
  canEditCalendar: boolean;
  canTakeAttendance: boolean;
  canManagePayments: boolean;
  canEditOwnProfile: boolean;
  canViewMemberDetails: boolean;
  canManageWardrobe: boolean;
  canAccessAdminFeatures: boolean;
  [key: string]: boolean;
}

// Helper function to get user permissions based on role
const getUserPermissions = (role: string): PermissionSet => {
  const basePermissions: PermissionSet = {
    canEditUsers: false,
    canDeleteUsers: false,
    canEditMusic: false,
    canUploadMusic: false,
    canEditCalendar: false,
    canTakeAttendance: false,
    canManagePayments: false,
    canEditOwnProfile: true,
    canViewMemberDetails: false,
    canManageWardrobe: false,
    canAccessAdminFeatures: false
  };

  switch (role) {
    case 'administrator':
      return {
        ...basePermissions,
        canEditUsers: true,
        canDeleteUsers: true,
        canEditMusic: true,
        canUploadMusic: true,
        canEditCalendar: true,
        canTakeAttendance: true,
        canManagePayments: true,
        canViewMemberDetails: true,
        canManageWardrobe: true,
        canAccessAdminFeatures: true
      };
    default:
      return basePermissions;
  }
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<PermissionSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

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
  }, []);

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
      window.location.href = '/login'; // Use direct navigation instead of useNavigate
    } catch (error: any) {
      console.error("Error during sign out:", error.message);
    }
  };

  // Add the missing methods
  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } catch (error: any) {
      console.error("Error during Google sign in:", error.message);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });
    } catch (error: any) {
      console.error("Error during Apple sign in:", error.message);
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating password:", error.message);
      throw error;
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
    hasPermission,
    signInWithGoogle,
    signInWithApple,
    updatePassword
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

// Export the PermissionSet type
export type { PermissionSet, Profile };

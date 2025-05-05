
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// Define user types
export type UserRole = "admin" | "member";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  voice_part?: "Soprano1" | "Soprano2" | "Alto1" | "Alto2" | "Tenor" | "Bass" | null;
  created_at: string;
  updated_at: string;
}

// Define auth context types
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Handle URL fragment parameters (used after email confirmation)
    const handleEmailConfirmation = async () => {
      // Check if we have a hash fragment from email confirmation
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      // If we have tokens from email confirmation
      if (accessToken && refreshToken && type === "recovery") {
        // Set the session using the tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Error setting session from email link:", error);
          toast({
            title: "Authentication failed",
            description: "There was a problem with your authentication link. Please try logging in again.",
            variant: "destructive",
          });
        } else if (data && data.session) {
          toast({
            title: "Authentication successful",
            description: "You have been successfully authenticated.",
          });

          // Clean the URL to remove the hash fragment
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    };

    // Call once on initial load to handle email confirmations
    handleEmailConfirmation();

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch user profile if we have a user
        if (currentSession?.user) {
          // Use setTimeout to prevent deadlock with Supabase auth
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        } else if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          navigate("/dashboard");
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Account updated",
            description: "Your account has been updated successfully.",
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send verification email",
        description: error.message || "Unable to send verification email. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Login with Apple
  const loginWithApple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Apple login failed",
        description: error.message || "Unable to sign in with Apple. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Unable to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    signUp,
    loginWithGoogle,
    loginWithApple,
    logout,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

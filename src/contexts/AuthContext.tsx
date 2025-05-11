import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AuthUser, AuthContextType, UserRole } from '@/types/auth';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any>(null);  // Add session state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, boolean> | undefined>(undefined);

  // Helper function to convert any role string to a valid UserRole
  const mapRoleToAuthUser = (userData: any): AuthUser => {
    // Extract needed properties
    const { id, email, role } = userData;
    
    let mappedRole: UserRole = 'general'; // Default role
    
    // Map string role to UserRole type
    if (role === 'admin' || role === 'director' || 
        role === 'section_leader' || role === 'singer' || 
        role === 'student_conductor' || role === 'accompanist' || 
        role === 'non_singer' || role === 'administrator' || 
        role === 'member') {
      mappedRole = role as UserRole;
    }
    
    // Return the user data with the role included
    return {
      id,
      email: email || undefined,
      role: mappedRole,
      ...userData, // Include other properties
    };
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session first
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Initial session:", sessionData.session);
        
        // Set auth state based on session
        if (sessionData.session) {
          setSession(sessionData.session);
          setIsAuthenticated(true);
          
          const authUser = mapRoleToAuthUser(sessionData.session.user);
          setUser(authUser);
          
          // Fetch profile data for authenticated user
          await fetchProfile(sessionData.session.user.id);
        } else {
          // No active session
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
          setPermissions(undefined);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          setSession(session);
          setIsAuthenticated(true);
          
          const authUser = mapRoleToAuthUser(session.user);
          setUser(authUser);
          
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } 
        // Fixed comparison - checking if event is either SIGNED_OUT or USER_DELETED
        else if (['SIGNED_OUT', 'USER_DELETED'].includes(event)) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
          setPermissions(undefined);
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string | undefined) => {
    if (!userId) {
      console.log("No user ID, cannot fetch profile");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching profile for user:", userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error('Failed to load profile');
        setIsLoading(false);
        return;
      }

      if (profileData) {
        console.log("Profile data loaded:", profileData);
        // Add id as user_id if it doesn't exist to satisfy the type requirements
        const completeProfile: Profile = {
          ...profileData,
          user_id: profileData.user_id || profileData.id
        };
        setProfile(completeProfile);
        
        // Try to load permissions but don't block on failure
        try {
          await refreshPermissions(userId);
        } catch (err) {
          console.error("Failed to load permissions but continuing:", err);
          // If the user is an admin or super admin, grant all permissions regardless
          if (profileData.is_super_admin || profileData.role === 'admin' || 
              profileData.role === 'administrator' || profileData.role === 'director') {
            console.log("User is super admin or has admin role, granting all permissions");
            setPermissions({
              can_view_financials: true,
              can_edit_financials: true,
              can_upload_sheet_music: true,
              can_view_sheet_music: true,
              can_edit_attendance: true,
              can_view_attendance: true,
              can_view_wardrobe: true,
              can_edit_wardrobe: true,
              can_upload_media: true,
              can_manage_tour: true,
              can_manage_stage: true,
              can_view_prayer_box: true,
              can_post_announcements: true,
              can_manage_users: true,
              can_manage_archives: true,
              can_post_social: true,
              can_view_travel_logistics: true,
              can_manage_spiritual_events: true,
              can_grade_submissions: true,
              can_upload_documents: true,
              can_view_events: true,
              can_submit_absence_form: true
            });
          }
        }
      } else {
        console.log("No profile found for user:", userId);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error during profile fetch:", error);
      toast.error('Error fetching profile');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPermissions = async (userId?: string) => {
    const id = userId || user?.id;
    if (!id) {
      console.warn("No user ID available to fetch permissions.");
      return;
    }

    try {
      console.log("Refreshing permissions for user:", id);
      const userPermissions = await fetchUserPermissions(id);
      
      // If user is super admin or has admin role but permissions failed to load,
      // manually set admin permissions
      if (!userPermissions && profile) {
        if (profile.is_super_admin || profile.role === 'admin' || 
            profile.role === 'administrator' || profile.role === 'director') {
          console.log("User is super admin or has admin role, granting all permissions");
          setPermissions({
            can_view_financials: true,
            can_edit_financials: true,
            can_upload_sheet_music: true,
            can_view_sheet_music: true,
            can_edit_attendance: true,
            can_view_attendance: true,
            can_view_wardrobe: true,
            can_edit_wardrobe: true,
            can_upload_media: true,
            can_manage_tour: true,
            can_manage_stage: true,
            can_view_prayer_box: true,
            can_post_announcements: true,
            can_manage_users: true,
            can_manage_archives: true,
            can_post_social: true,
            can_view_travel_logistics: true,
            can_manage_spiritual_events: true,
            can_grade_submissions: true,
            can_upload_documents: true,
            can_view_events: true,
            can_submit_absence_form: true
          });
          return;
        }
      }
      
      if (userPermissions) {
        console.log("User permissions loaded:", userPermissions);
        setPermissions(userPermissions);
      } else {
        console.warn("No permissions fetched, or an error occurred.");
        setPermissions({});
      }
    } catch (error) {
      console.error("Error refreshing permissions:", error);
      // Don't toast here as it might disrupt login flow
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error("Sign-in error:", error);
        toast.error('Sign-in failed');
        return { error };
      }

      toast.success('Sign-in successful');
      return { error: null };
    } catch (err) {
      console.error("Error during sign-in:", err);
      toast.error('Error during sign-in');
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: string = 'member') => {
    try {
      console.log("SignUp attempt with role:", role);
      
      // Use Supabase's signUp method with metadata that includes the user's role
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role // Ensure this is included in the metadata
          },
        },
      });

      if (error) {
        console.error("SignUp error:", error);
        return { error, data: null };
      }

      console.log("SignUp successful, user:", data.user);
      return { error: null, data };
    } catch (e: any) {
      console.error("Unexpected error in signUp:", e);
      return { error: e, data: null };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign-out error:", error);
        toast.error('Sign-out failed');
        return;
      }

      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      setPermissions(undefined);
      
      toast.success('Signed out successfully');
    } catch (err) {
      console.error("Error during sign-out:", err);
      toast.error('Error during sign-out');
    }
  };

  // Alias these methods for backwards compatibility with updated return types
  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    return result;
  };

  const logout = async () => {
    await signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast.error('Failed to send password reset email');
        return { error };
      }

      toast.success('Password reset email sent');
      return { error: null };
    } catch (err) {
      toast.error('Error sending password reset email');
      return { error: err };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log("Updating password");
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Update password error:", error);
        toast.error('Failed to update password');
        return;
      }

      toast.success('Password updated successfully');
    } catch (err) {
      console.error("Error during password update:", err);
      toast.error('Error during password update');
    }
  };

  // Check if the user has an admin role
  const isAdmin = useCallback(() => {
    if (!profile) return false;
    
    // Check for admin role in profile, or super_admin flag, or admin title
    return profile.role === 'admin' || 
           profile.role === 'director' || 
           profile.is_super_admin === true || 
           profile.title === 'Super Admin';
  }, [profile]);

  const value: AuthContextType = {
    user,
    profile,
    loading: false, // Legacy prop kept for backwards compatibility
    isAuthenticated: !!user,
    isLoading,
    permissions,
    signIn,
    signUp,
    signOut,
    login,
    logout,
    isAdmin,
    updatePassword,
    refreshPermissions,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

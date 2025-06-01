
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { ProfileErrorDisplay } from "@/components/dashboard/ProfileErrorDisplay";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function MemberDashboardPage() {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    setIsLoadingProfile(true);
    setProfileError(null);
    
    try {
      console.log('📊 MemberDashboard: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('❌ MemberDashboard: Profile fetch error:', error);
        setProfileError('Failed to load profile data');
        return;
      }
      
      if (!data) {
        console.warn('⚠️ MemberDashboard: No profile found for user:', userId);
        setProfileError('Profile not found');
        return;
      }
      
      console.log('✅ MemberDashboard: Profile loaded:', {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role,
        status: data.status
      });
      
      setProfile(data);
    } catch (error) {
      console.error('💥 MemberDashboard: Unexpected error fetching profile:', error);
      setProfileError('Unexpected error loading profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Handle authentication and profile loading
  useEffect(() => {
    console.log('📊 MemberDashboard: Auth state check:', {
      isInitialized,
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id
    });

    // Wait for initialization
    if (!isInitialized) {
      return;
    }

    // Check authentication
    if (!isAuthenticated || !user) {
      console.log('🚫 MemberDashboard: Not authenticated, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Fetch profile if we have a user
    if (user.id && !profile && !isLoadingProfile) {
      fetchUserProfile(user.id);
    }
  }, [isInitialized, isAuthenticated, user, navigate, profile, isLoadingProfile]);

  // Show loading during initialization
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Initializing dashboard..."
        className="min-h-screen"
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while fetching profile
  if (isLoadingProfile) {
    return (
      <PageLoader 
        message="Loading your profile..."
        className="min-h-screen"
      />
    );
  }

  // Show error if profile fetch failed
  if (profileError) {
    return (
      <ProfileErrorDisplay
        user={user}
        profileError={profileError}
        onRetry={() => fetchUserProfile(user.id)}
        onBackToLogin={() => navigate('/login', { replace: true })}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <DashboardHeader user={user} profile={profile} />
        <DashboardContent />
      </div>
    </ErrorBoundary>
  );
}

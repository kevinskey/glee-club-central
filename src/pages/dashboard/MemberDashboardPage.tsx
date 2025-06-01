
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { PageLoader } from "@/components/ui/page-loader";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    return (
      <PageLoader 
        message="Redirecting to login..."
        className="min-h-screen"
      />
    );
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Profile Error</CardTitle>
            <CardDescription>
              {profileError}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">User Details</span>
              </div>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => fetchUserProfile(user.id)}
                className="w-full"
              >
                Retry Loading Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login', { replace: true })}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get display name with fallbacks
  const displayName = profile?.first_name || 
                     user?.user_metadata?.first_name || 
                     user?.email?.split('@')[0] || 
                     'Member';

  const lastName = profile?.last_name || user?.user_metadata?.last_name || '';
  const fullName = lastName ? `${displayName} ${lastName}` : displayName;
  const memberRole = profile?.role || 'member';
  const memberStatus = profile?.status || 'active';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          Member Dashboard • {memberRole} • {memberStatus}
        </p>
      </div>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Full Name:</span> {fullName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Role:</span> {memberRole}
            </div>
            <div>
              <span className="font-medium">Status:</span> {memberStatus}
            </div>
            {profile?.voice_part && (
              <div>
                <span className="font-medium">Voice Part:</span> {profile.voice_part}
              </div>
            )}
            {profile?.class_year && (
              <div>
                <span className="font-medium">Class Year:</span> {profile.class_year}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardModules />
          <DashboardEvents events={[]} />
        </div>
        <div className="space-y-6">
          <DashboardAnnouncements />
        </div>
      </div>
    </div>
  );
}

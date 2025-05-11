
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Home, 
  Bell,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardQuickAccess } from "@/components/dashboard/DashboardQuickAccess";

const DashboardPage = () => {
  const { profile, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Add debug info to the console
  useEffect(() => {
    console.log("Dashboard mounting...");
    console.log("Auth loading state:", authLoading);
    console.log("Auth state:", isAuthenticated);
    console.log("Profile data:", profile);
    
    // Set a timeout to simulate data loading and then remove the loading state
    const timer = setTimeout(() => {
      console.log("Setting loading to false");
      setLoading(false);
      console.log("Dashboard loaded");
    }, 1000);
    
    // Clean up the timer
    return () => {
      console.log("Dashboard unmounting, clearing timer");
      clearTimeout(timer);
    };
  }, [profile, authLoading, isAuthenticated]);

  if (loading || authLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.first_name || 'Member'}`}
        description={`Dashboard - ${profile?.title || 'Member'}`}
        icon={<Home className="h-6 w-6" />}
      />
      
      {/* Quick Access Section */}
      <DashboardQuickAccess />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upcoming Events Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your scheduled events</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <DashboardEvents />
          </CardContent>
        </Card>
        
        {/* Announcements Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </div>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <DashboardAnnouncements />
          </CardContent>
        </Card>
        
        {/* Role-Based Dashboard Modules */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Your Dashboard</CardTitle>
            <CardDescription>Modules available based on your {profile?.title || 'role'}</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardModules />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

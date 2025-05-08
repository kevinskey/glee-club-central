
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  FileText, 
  Home, 
  Music, 
  Bell, 
  UserRound,
  Headphones,
  Video,
  BookOpen,
  Activity
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const DashboardPage = () => {
  // Properly define a default for the profile to avoid TypeScript errors
  const { profile, isAuthenticated, isLoading: authLoading } = useAuth();
  const profileData = profile || { first_name: 'Member', last_name: '', role: '', status: '' };
  
  // Sample data for dashboard components
  const upcomingEvents = [
    { id: 1, title: "Weekly Rehearsal", date: "Today", time: "6:00 PM" },
    { id: 2, title: "Spring Concert", date: "May 15", time: "7:00 PM" },
    { id: 3, title: "Sectional Practice", date: "May 10", time: "3:00 PM" }
  ];
  
  const announcements = [
    { id: 1, title: "New Sheet Music Available", message: "The sheet music for our spring concert is now available." },
    { id: 2, title: "Rehearsal Schedule Update", message: "Please note that rehearsals will now be held on Tuesdays and Thursdays." }
  ];
  
  // Add loading indicator
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
    }, 1000); // Increased from 500ms to give more time
    
    // Clean up the timer
    return () => {
      console.log("Dashboard unmounting, clearing timer");
      clearTimeout(timer);
    };
  }, [profile, authLoading, isAuthenticated]);
  
  console.log("Current loading state:", loading);
  
  if (loading || authLoading) {
    console.log("Rendering loading spinner");
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  console.log("Rendering dashboard content");
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={`Welcome, ${profileData.first_name}`}
        description="Your Glee Club Dashboard"
        icon={<Home className="h-6 w-6" />}
      />
      
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
            <div className="space-y-4">
              {upcomingEvents && upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="border-b pb-3 last:border-0">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{event.date}</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No upcoming events</div>
              )}
            </div>
            <div className="mt-4">
              <Link 
                to="/dashboard/calendar" 
                className="text-sm text-primary hover:underline"
              >
                View full calendar
              </Link>
            </div>
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
            <div className="space-y-4">
              {announcements && announcements.length > 0 ? (
                announcements.map(announcement => (
                  <div key={announcement.id} className="pb-3 border-b last:border-0">
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No announcements</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Access Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/dashboard/sheet-music" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors text-center">
                <FileText className="h-8 w-8 mb-2" />
                <span>Sheet Music</span>
              </Link>
              <Link to="/dashboard/recordings" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors text-center">
                <Music className="h-8 w-8 mb-2" />
                <span>Recordings</span>
              </Link>
              <Link to="/dashboard/practice" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors text-center">
                <Headphones className="h-8 w-8 mb-2" />
                <span>Practice</span>
              </Link>
              <Link to="/dashboard/videos" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors text-center">
                <Video className="h-8 w-8 mb-2" />
                <span>Videos</span>
              </Link>
              <Link to="/dashboard/profile" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors text-center">
                <UserRound className="h-8 w-8 mb-2" />
                <span>Profile</span>
              </Link>
              <Link to="/dashboard/calendar" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors text-center">
                <Calendar className="h-8 w-8 mb-2" />
                <span>Calendar</span>
              </Link>
              <Link to="/dashboard/handbook" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors text-center">
                <BookOpen className="h-8 w-8 mb-2" />
                <span>Handbook</span>
              </Link>
              <Link to="/dashboard/attendance" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors text-center">
                <Activity className="h-8 w-8 mb-2" />
                <span>Attendance</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

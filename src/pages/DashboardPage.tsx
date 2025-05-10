
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, 
  Home, 
  Bell,
  FileText,
  Music,
  User,
  CheckSquare,
  Shirt,
  DollarSign
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { format } from "date-fns";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const DashboardPage = () => {
  // Properly define a default for the profile to avoid TypeScript errors
  const { profile, isAuthenticated, isLoading: authLoading, permissions } = useAuth();
  const profileData = profile || { first_name: 'Member', last_name: '', role: '', status: '' };
  
  // Get calendar events from the hook
  const { events, loading: eventsLoading } = useCalendarEvents();
  
  // Add loading indicator
  const [loading, setLoading] = useState(true);
  
  // Upcoming events state
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const location = useLocation();

  // Sample announcements data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "End of Semester Performance",
      message: "Our final performance will be held on May 15th at Sisters Chapel. All members must attend dress rehearsal."
    },
    {
      id: 2,
      title: "Dues Reminder",
      message: "Spring semester dues are due by April 30th. Please make your payments online through the dashboard."
    },
    {
      id: 3,
      title: "New Sheet Music Available",
      message: "New arrangements for the Spring concert have been uploaded. Please review before next rehearsal."
    }
  ]);

  // Quick access links for members
  const quickAccessLinks = [
    { icon: <User className="h-5 w-5" />, title: "My Profile", path: "/dashboard/profile", color: "bg-blue-500" },
    { icon: <Music className="h-5 w-5" />, title: "Sheet Music", path: "/dashboard/sheet-music", color: "bg-purple-500" },
    { icon: <Calendar className="h-5 w-5" />, title: "Calendar", path: "/dashboard/calendar", color: "bg-green-500" },
    { icon: <CheckSquare className="h-5 w-5" />, title: "Attendance", path: "/dashboard/attendance", color: "bg-orange-500" },
    { icon: <Shirt className="h-5 w-5" />, title: "Wardrobe", path: "/dashboard/profile?tab=wardrobe", color: "bg-pink-500" },
    { icon: <DollarSign className="h-5 w-5" />, title: "Dues", path: "/dashboard/profile?tab=financial", color: "bg-amber-500" },
  ];

  // Add debug info to the console
  useEffect(() => {
    console.log("Dashboard mounting...");
    console.log("Auth loading state:", authLoading);
    console.log("Auth state:", isAuthenticated);
    console.log("Profile data:", profile);
    console.log("User permissions:", permissions);
    
    // Set a timeout to simulate data loading and then remove the loading state
    const timer = setTimeout(() => {
      console.log("Setting loading to false");
      setLoading(false);
      console.log("Dashboard loaded");
    }, 1000);
    
    // Check for permission denied status
    if (location.state?.permissionDenied) {
      toast.error("You don't have permission to access that page");
    }
    
    // Clean up the timer
    return () => {
      console.log("Dashboard unmounting, clearing timer");
      clearTimeout(timer);
    };
  }, [profile, authLoading, isAuthenticated, permissions, location.state]);

  // Process and set upcoming events when events are loaded
  useEffect(() => {
    if (!eventsLoading && events.length > 0) {
      console.log("Processing calendar events for dashboard...");
      
      // Get today's date and filter upcoming events
      const today = new Date();
      const upcoming = events
        .filter(event => event.date >= today)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 3) // Get first 3 upcoming events
        .map(event => ({
          id: event.id,
          title: event.title,
          date: format(event.date, 'MMM d'),
          time: event.time,
          location: event.location
        }));
      
      setUpcomingEvents(upcoming);
      console.log("Dashboard upcoming events set:", upcoming);
    }
  }, [events, eventsLoading]);
  
  if (loading || authLoading || eventsLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={`Welcome, ${profileData.first_name}`}
        description={`Dashboard - ${profile?.title || 'Member'}`}
        icon={<Home className="h-6 w-6" />}
      />
      
      {/* Quick Access Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Frequently used Glee Club resources</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {quickAccessLinks.map((link, index) => (
              <Link key={index} to={link.path} className="no-underline">
                <Button 
                  variant="outline" 
                  className="w-full h-auto flex-col py-4 gap-2 hover:border-primary"
                >
                  <div className={`${link.color} text-white p-2 rounded-full`}>
                    {link.icon}
                  </div>
                  <span className="text-xs font-medium">{link.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      
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
                    {event.location && <div className="text-xs text-muted-foreground">{event.location}</div>}
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
            <div className="mt-4">
              <Link 
                to="/dashboard/announcements" 
                className="text-sm text-primary hover:underline"
              >
                View all announcements
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Member Resources */}
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Member Resources</CardTitle>
                <CardDescription>Important documents and resources</CardDescription>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/dashboard/handbook" className="no-underline">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Glee Club Handbook</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Access the official handbook with rules and guidelines
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/dashboard/sheet-music" className="no-underline">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sheet Music</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Browse and download all current repertoire
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/dashboard/practice" className="no-underline">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Practice Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice tracks and sight reading exercises
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/dashboard/recordings" className="no-underline">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recordings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Access past performances and rehearsal recordings
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
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

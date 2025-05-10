
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Home, 
  Bell,
  FileText,
  Music,
  User,
  CheckSquare,
  Shirt,
  DollarSign,
  MessageSquare,
  Users,
  Upload,
  BarChart,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
}

interface Announcement {
  id: number;
  title: string;
  message: string;
}

const DashboardPage = () => {
  const { profile, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
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
  
  // Fetch events from the database
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gt('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(3);
        
      if (error) throw error;
      
      if (data) {
        // Convert string dates to Date objects
        setEvents(data.map(event => ({
          ...event,
          date: new Date(event.date)
        })));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    // Load data
    const loadData = async () => {
      await fetchEvents();
      setLoading(false);
    };
    
    if (!authLoading) {
      loadData();
    }
  }, [authLoading]);
  
  // Quick access links for users
  const quickAccessLinks = [
    { icon: <User className="h-5 w-5" />, title: "My Profile", path: "/dashboard/profile", color: "bg-blue-500" },
    { icon: <Music className="h-5 w-5" />, title: "Sheet Music", path: "/dashboard/sheet-music", color: "bg-purple-500" },
    { icon: <Calendar className="h-5 w-5" />, title: "Calendar", path: "/dashboard/schedule", color: "bg-green-500" },
    { icon: <CheckSquare className="h-5 w-5" />, title: "Attendance", path: "/dashboard/attendance", color: "bg-orange-500" },
    { icon: <Bell className="h-5 w-5" />, title: "Announcements", path: "/dashboard/announcements", color: "bg-red-500" },
    { icon: <MessageSquare className="h-5 w-5" />, title: "Contact Admin", path: "/dashboard/contact", color: "bg-indigo-500" },
  ];
  
  // Admin quick links
  const adminQuickLinks = [
    { icon: <Users className="h-5 w-5" />, title: "User Management", path: "/dashboard/admin/users", color: "bg-slate-500" },
    { icon: <Upload className="h-5 w-5" />, title: "Media Manager", path: "/dashboard/admin/media", color: "bg-emerald-500" },
    { icon: <Calendar className="h-5 w-5" />, title: "Event Manager", path: "/dashboard/admin/events", color: "bg-yellow-500" },
    { icon: <BarChart className="h-5 w-5" />, title: "Analytics", path: "/dashboard/admin/analytics", color: "bg-violet-500" },
    { icon: <Settings className="h-5 w-5" />, title: "Site Settings", path: "/dashboard/admin/settings", color: "bg-rose-500" },
  ];
  
  if (loading || authLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Display appropriate dashboard based on role
  const isAdminUser = isAdmin();
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.first_name || 'User'}`}
        description={`Dashboard - ${isAdminUser ? 'Administrator' : 'Member'}`}
        icon={<Home className="h-6 w-6" />}
      />
      
      {/* Quick Access Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                {isAdminUser ? "Administrative Tools" : "Frequently used resources"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {(isAdminUser ? adminQuickLinks : quickAccessLinks).map((link, index) => (
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
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event.id} className="border-b pb-3 last:border-0">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{event.date.toLocaleDateString()}</span>
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
                to="/dashboard/schedule" 
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
              {announcements.map(announcement => (
                <div key={announcement.id} className="pb-3 border-b last:border-0">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                </div>
              ))}
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
        
        {/* Available Modules */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Available Resources</CardTitle>
            <CardDescription>Features available to you</CardDescription>
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

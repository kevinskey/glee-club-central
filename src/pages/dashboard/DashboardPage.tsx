import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeaderWithToggle } from "@/components/ui/page-header-with-toggle";
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
  Clock,
  Calendar as CalendarIcon,
  Headphones,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Shield
} from "lucide-react";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { DashboardQuickAccess } from "@/components/dashboard/DashboardQuickAccess";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

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
  date: string;
}

const DashboardPage = () => {
  const { profile, isLoading: authLoading, isAdmin } = useAuth();
  const { promoteToSuperAdmin, isUpdating, isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  
  // Define announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "End of Semester Performance",
      message: "Our final performance will be held on May 15th at Sisters Chapel. All members must attend dress rehearsal.",
      date: "May 1, 2025"
    },
    {
      id: 2,
      title: "Dues Reminder",
      message: "Spring semester dues are due by April 30th. Please make your payments online through the dashboard.",
      date: "April 15, 2025"
    },
    {
      id: 3,
      title: "New Sheet Music Available",
      message: "New arrangements for the Spring concert have been uploaded. Please review before next rehearsal.",
      date: "April 10, 2025"
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
  
  // Next upcoming event for countdown
  const nextEvent = events && events.length > 0 ? events[0] : null;
  
  // Calculate days until next event
  const getDaysUntilNextEvent = () => {
    if (!nextEvent) return null;
    
    const today = new Date();
    const eventDate = new Date(nextEvent.date);
    const diffTime = Math.abs(eventDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilNextEvent = getDaysUntilNextEvent();
  
  if (loading || authLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  const handleRegisterAsAdmin = () => {
    // Navigate to admin dashboard instead of register/admin
    navigate("/dashboard/admin");
  };
  
  return (
    <div className="container mx-auto p-4 space-y-8">
      <PageHeaderWithToggle
        title={`Welcome, ${profile?.first_name || 'Member'}`}
        description="Your Spelman College Glee Club dashboard"
        icon={<Home className="h-6 w-6" />}
      />
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Today's Agenda */}
        <div className="md:col-span-2 space-y-8">
          {/* Next Event Countdown */}
          {nextEvent && (
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-glee-spelman to-glee-spelman/90 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Next Performance Countdown</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {daysUntilNextEvent} {daysUntilNextEvent === 1 ? 'day' : 'days'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{nextEvent.title}</h3>
                  <div className="flex justify-between text-sm text-white/90">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{nextEvent.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{nextEvent.time}</span>
                    </div>
                  </div>
                  {nextEvent.location && (
                    <div className="text-sm flex items-center gap-2 mt-2">
                      <span className="font-medium">Location:</span> 
                      <span>{nextEvent.location}</span>
                    </div>
                  )}
                  <div className="mt-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate("/dashboard/calendar")} 
                      className="bg-white text-glee-spelman hover:bg-white/90"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Upcoming Events */}
          <Card className="shadow-md border-t-4 border-t-glee-spelman">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-glee-spelman" />
                  <span>Today's Agenda</span>
                </CardTitle>
                <Link to="/dashboard/calendar" className="text-sm text-glee-spelman hover:underline font-medium">
                  View Calendar
                </Link>
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
            </CardContent>
          </Card>
          
          {/* Rehearsal Notes */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-glee-spelman" />
                <span>Rehearsal Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-md border bg-muted/30">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Spring Concert Preparation</span>
                    <span className="text-muted-foreground">April 28, 2025</span>
                  </div>
                  <p className="text-sm">
                    Focus on dynamics in "Lift Every Voice" measures 24-36. 
                    Sopranos, work on breath control in the sustained high notes.
                    Everyone should memorize first verse by next rehearsal.
                  </p>
                </div>
                <Link 
                  to="/dashboard/sheet-music" 
                  className="text-sm text-glee-spelman hover:underline inline-flex font-medium"
                >
                  View all notes
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Announcements Card */}
          <Card className="shadow-md border-t-4 border-t-glee-spelman">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-glee-spelman" />
                  <span>Announcements</span>
                </CardTitle>
                <Link to="/dashboard/announcements" className="text-sm text-glee-spelman hover:underline font-medium">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements && announcements.length > 0 ? (
                  announcements.map(announcement => (
                    <div key={announcement.id} className="pb-3 border-b last:border-0">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium text-sm">{announcement.title}</h3>
                        <span className="text-xs text-muted-foreground">{announcement.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{announcement.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No announcements</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Quick Access */}
        <div className="space-y-8">
          {/* Quick Access */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-glee-spelman" />
                <span>Quick Access</span>
              </CardTitle>
              <CardDescription>
                Frequently used resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto flex-col py-6 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 min-h-[90px] whitespace-normal text-center"
                  onClick={() => navigate("/dashboard/sheet-music")}
                >
                  <Music className="h-6 w-6 mb-2 text-glee-spelman" />
                  <span className="text-sm">Sheet Music</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto flex-col py-6 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 min-h-[90px] whitespace-normal text-center"
                  onClick={() => navigate("/dashboard/practice")}
                >
                  <Headphones className="h-6 w-6 mb-2 text-glee-spelman" />
                  <span className="text-sm">Practice Tracks</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto flex-col py-6 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 min-h-[90px] whitespace-normal text-center"
                  onClick={() => navigate("/dashboard/attendance")}
                >
                  <CheckSquare className="h-6 w-6 mb-2 text-glee-spelman" />
                  <span className="text-sm">Attendance</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto flex-col py-6 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 min-h-[90px] whitespace-normal text-center"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  <User className="h-6 w-6 mb-2 text-glee-spelman" />
                  <span className="text-sm">My Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Dues Status Card */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-glee-spelman" />
                <span>Dues Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Academic Year 2025</span>
                  <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Paid
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Amount: $100.00</span>
                  <span>Paid on: April 15, 2025</span>
                </div>
                <Button 
                  onClick={() => navigate("/dashboard/dues")}
                  variant="outline" 
                  className="w-full mt-2 text-glee-spelman border-glee-spelman/20 hover:bg-glee-spelman/5"
                >
                  View Payment History
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Development Tools - Only visible during development */}
          <Card className="shadow-md border-orange-400">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                <span>Development Tools</span>
              </CardTitle>
              <CardDescription>
                Helper tools for development only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full border-orange-400 text-orange-600 hover:bg-orange-50"
                onClick={promoteToSuperAdmin}
                disabled={isUpdating || isSuperAdmin}
              >
                {isUpdating ? "Promoting..." : isSuperAdmin ? "Already Super Admin" : "Make Me Super Admin"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                For development only. Sets your account as a super admin with all permissions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6">
        {/* External Resources */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-glee-spelman" />
              <span>Resources</span>
            </CardTitle>
            <CardDescription>Spelman College Links & Social Media</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Button
                variant="outline"
                className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
                onClick={() => window.open("https://www.spelman.edu", "_blank")}
              >
                <Globe className="h-6 w-6 mb-2 text-glee-spelman" />
                <span className="text-sm">Spelman College</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
                onClick={() => window.open("https://www.instagram.com/spelmanglee/", "_blank")}
              >
                <Instagram className="h-6 w-6 mb-2 text-glee-spelman" />
                <span className="text-sm">Instagram</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
                onClick={() => window.open("https://www.facebook.com/SpelmanGlee/", "_blank")}
              >
                <Facebook className="h-6 w-6 mb-2 text-glee-spelman" />
                <span className="text-sm">Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
                onClick={() => window.open("https://www.tiktok.com/@spelmanglee", "_blank")}
              >
                <Icons.tiktok className="h-6 w-6 mb-2 text-glee-spelman" />
                <span className="text-sm">TikTok</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto flex-col py-4 px-3 hover:bg-glee-spelman/5 hover:text-glee-spelman hover:border-glee-spelman/20 whitespace-normal text-center"
                onClick={() => window.open("https://www.youtube.com/@SpelmanCollegeGleeClub", "_blank")}
              >
                <Youtube className="h-6 w-6 mb-2 text-glee-spelman" />
                <span className="text-sm">YouTube</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin registration link - now shown to ALL users regardless of admin status */}
      <Card className="border-glee-spelman/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Administrator Dashboard</CardTitle>
          <CardDescription>
            Access the administrator dashboard to manage Glee Club resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="border-glee-spelman text-glee-spelman hover:bg-glee-spelman/5"
            onClick={handleRegisterAsAdmin}
          >
            Go to Admin Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

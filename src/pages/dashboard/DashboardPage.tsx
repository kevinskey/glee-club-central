
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Music, 
  Bell, 
  Headphones, 
  FileText, 
  User,
  ChevronRight,
  Clock,
  CalendarDays,
  ArrowRight,
  Mic
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import ErrorBoundary from "@/components/ErrorBoundary";
import { NextEventCountdown } from "@/components/dashboard/NextEventCountdown";
import { RehearsalNotes } from "@/components/dashboard/RehearsalNotes";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";
import { QuickAccess } from "@/components/dashboard/QuickAccess";
import { DuesStatusCard } from "@/components/dashboard/DuesStatusCard";
import { AdminDashboardAccess } from "@/components/dashboard/AdminDashboardAccess";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GleeTools } from "@/components/glee-tools/GleeTools";

export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
}

const DashboardPageContent = () => {
  const { profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const { isAdminRole, isSuperAdmin } = usePermissions();
  
  // Get current time of day for greeting - memoized to prevent re-renders
  const getTimeOfDay = useCallback(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);
  
  // Memoized fetch events function to prevent recreation on each render
  const fetchEvents = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (!authLoading) {
      const loadData = async () => {
        setLoading(true);
        try {
          await fetchEvents();
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [authLoading, fetchEvents]);
  
  // Next upcoming event for countdown - memoize to prevent re-renders
  const nextEvent = useMemo(() => 
    events && events.length > 0 ? events[0] : null, 
    [events]
  );
  
  const handleRegisterAsAdmin = () => {
    navigate("/dashboard/admin");
  };
  
  // Show loading only when actually loading
  if (authLoading || loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
    
  return (
    <div className="max-w-screen-2xl mx-auto px-4 space-y-6">
      {/* Welcome Banner with User Info */}
      <div className="bg-gradient-to-r from-glee-spelman to-glee-spelman/80 rounded-xl shadow-lg p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">{getTimeOfDay()}, {profile?.first_name || 'Member'}</h1>
            <p className="text-white/80">Welcome to your Spelman College Glee Club dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg"
              variant="secondary" 
              className="bg-white hover:bg-white/90 text-glee-spelman"
              asChild
            >
              <Link to="/dashboard/profile">View Profile <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            
            <Button 
              size="lg"
              variant="outline" 
              className="bg-white/20 text-white hover:bg-white/30 border-white/40"
              asChild
            >
              <Link to="/dashboard/member">
                Member Dashboard <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Member Resources Section */}
      <Card className="shadow-md border-l-4 border-l-glee-spelman">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold flex items-center">
                <Mic className="h-5 w-5 mr-2 text-glee-spelman" />
                Member Resources
              </h2>
              <p className="text-muted-foreground mt-1">
                Access specialized tools for Glee Club members
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-glee-spelman hover:bg-glee-spelman/90">
                <Link to="/dashboard/member">
                  Member Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/recording-studio">
                  <Mic className="h-4 w-4 mr-2" />
                  Recording Studio
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* GleeTools Section */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Headphones className="h-5 w-5 mr-2 text-glee-spelman" />
            <span>Glee Tools</span>
          </CardTitle>
          <CardDescription>
            Access music practice tools for rehearsal and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GleeTools variant="default" className="my-2" />
        </CardContent>
      </Card>
      
      {/* Quick Access Grid */}
      <QuickAccess />
      
      {/* Next Event Countdown */}
      {nextEvent && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Next Performance</h2>
          <NextEventCountdown event={nextEvent} />
        </div>
      )}
      
      {/* Dashboard Content in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Column 1 - Main Content */}
        <div className="md:col-span-8 space-y-6">
          {/* Upcoming Events */}
          <Card className="shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-glee-spelman" />
                <CardTitle>Upcoming Events</CardTitle>
              </div>
              <Button 
                variant="link" 
                className="text-sm text-glee-spelman hover:underline p-0"
                asChild
              >
                <Link to="/dashboard/calendar">View Calendar</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((event, index) => (
                    <div key={index} className="flex items-start border-b last:border-0 pb-3 last:pb-0">
                      <div className="bg-muted text-center p-2 rounded-md min-w-[60px]">
                        <div className="text-xs font-medium text-muted-foreground">{event.date.toLocaleDateString(undefined, { month: 'short' })}</div>
                        <div className="text-lg font-bold">{event.date.getDate()}</div>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" /> {event.time}
                          {event.location && <span>• {event.location}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">No upcoming events scheduled.</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/calendar">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      View Calendar
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Rehearsal Notes */}
          <RehearsalNotes />
          
          {/* Announcements */}
          <DashboardAnnouncements />
        </div>
        
        {/* Column 2 - Side Content */}
        <div className="md:col-span-4 space-y-6">
          {/* Dues Status Card */}
          <DuesStatusCard />
          
          {/* Latest Resources */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-glee-spelman" />
                <span>Latest Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">New Sheet Music</h4>
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <p className="text-sm font-medium">Lift Every Voice and Sing</p>
                    <p className="text-xs text-muted-foreground">Added: May 5, 2025</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <p className="text-sm font-medium">Ave Maria</p>
                    <p className="text-xs text-muted-foreground">Added: May 3, 2025</p>
                  </div>
                </div>
                
                <Button 
                  variant="link"
                  className="flex items-center justify-center w-full text-sm text-glee-spelman hover:underline"
                  asChild
                >
                  <Link to="/dashboard/sheet-music">View all resources <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Admin Dashboard Access (only if admin) */}
          {(isAdminRole || isSuperAdmin) && (
            <AdminDashboardAccess onAccess={handleRegisterAsAdmin} />
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the component with ErrorBoundary for better error handling
const DashboardPage = React.memo(() => {
  return (
    <ErrorBoundary>
      <DashboardPageContent />
    </ErrorBoundary>
  );
});

export default DashboardPage;

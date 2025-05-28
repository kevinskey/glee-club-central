
import React, { useMemo } from "react";
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
import { useDashboardData } from "@/hooks/useDashboardData";
import { useLoadingCoordinator } from "@/hooks/useLoadingCoordinator";
import { 
  DashboardWelcomeSkeleton, 
  DashboardCardSkeleton, 
  DashboardEventsSkeleton, 
  DashboardSidebarSkeleton 
} from "@/components/ui/dashboard-skeleton";

export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
}

// Memoized skeleton component to prevent re-renders
const DashboardLoadingSkeleton = React.memo(() => (
  <div className="max-w-screen-2xl mx-auto px-4 space-y-6 dashboard-content dashboard-loading">
    <DashboardWelcomeSkeleton />
    <DashboardCardSkeleton />
    <DashboardCardSkeleton />
    <QuickAccess />
    
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8 space-y-6">
        <DashboardEventsSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>
      <div className="md:col-span-4">
        <DashboardSidebarSkeleton />
      </div>
    </div>
  </div>
));

const DashboardPageContent = React.memo(() => {
  const { profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { events, isReady, error } = useDashboardData();
  const { isAdminRole, isSuperAdmin } = usePermissions();
  const { isAnyLoading, isReady: coordinatorReady } = useLoadingCoordinator();
  
  // Check if user is admin
  const userRole = profile?.role;
  const isAdmin = profile?.is_super_admin || isAdminRole || isSuperAdmin;
  
  // Memoize expensive computations
  const shouldShowLoading = useMemo(() => 
    authLoading || !isReady || isAnyLoading(),
    [authLoading, isReady, isAnyLoading]
  );
  
  const getTimeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);
  
  const nextEvent = useMemo(() => 
    events && events.length > 0 ? events[0] : null, 
    [events]
  );
  
  const handleRegisterAsAdmin = React.useCallback(() => {
    navigate("/dashboard/admin");
  }, [navigate]);
  
  console.log('Dashboard render state:', { 
    authLoading, 
    isReady, 
    coordinatorReady, 
    isAnyLoading: isAnyLoading(),
    eventsCount: events?.length || 0,
    shouldShowLoading,
    isAdmin,
    userRole
  });
  
  // Show loading state with stable skeleton
  if (shouldShowLoading) {
    console.log('Showing loading skeletons');
    return <DashboardLoadingSkeleton />;
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  console.log('Rendering dashboard content with', events?.length || 0, 'events');
    
  return (
    <div className="max-w-screen-2xl mx-auto px-4 space-y-6 dashboard-content dashboard-loaded">
      {/* Welcome Banner - Different for Admin vs Member */}
      <div className={`bg-gradient-to-r ${isAdmin ? 'from-glee-spelman to-glee-spelman/80' : 'from-glee-purple to-glee-purple/80'} rounded-xl shadow-lg p-6 md:p-8 text-white`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {getTimeOfDay}, {profile?.first_name || 'Member'}
            </h1>
            <p className="text-white/80">
              {isAdmin 
                ? 'Welcome to the Spelman College Glee Club Admin Dashboard' 
                : 'Welcome to your Spelman College Glee Club Dashboard'
              }
            </p>
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
            
            {isAdmin && (
              <Button 
                size="lg"
                variant="outline" 
                className="bg-white/20 text-white hover:bg-white/30 border-white/40"
                asChild
              >
                <Link to="/admin">
                  Admin Panel <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Admin Tools Section - Only for admins */}
      {isAdmin && (
        <Card className="shadow-md border-l-4 border-l-glee-spelman">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-semibold flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-glee-spelman" />
                  Administrative Tools
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage the Glee Club and access administrative features
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-glee-spelman hover:bg-glee-spelman/90">
                  <Link to="/admin">
                    Admin Panel
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/dashboard/members">
                    <User className="h-4 w-4 mr-2" />
                    Manage Members
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                <Link to="/dashboard/announcements">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {events && events.length > 0 ? (
                <div className="space-y-3">
                  {events.slice(0, 3).map((event, index) => (
                    <div key={event.id || index} className="flex items-start border-b last:border-0 pb-3 last:pb-0">
                      <div className="bg-muted text-center p-2 rounded-md min-w-[60px]">
                        <div className="text-xs font-medium text-muted-foreground">
                          {new Date(event.start).toLocaleDateString(undefined, { month: 'short' })}
                        </div>
                        <div className="text-lg font-bold">{new Date(event.start).getDate()}</div>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" /> 
                          {new Date(event.start).toLocaleTimeString(undefined, { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
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
                    <Link to="/dashboard/announcements">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      View Announcements
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
          
          {/* Admin Dashboard Access - Only for admins */}
          {isAdmin && <AdminDashboardAccess onAccess={handleRegisterAsAdmin} />}
        </div>
      </div>
    </div>
  );
});

// Wrap the component with ErrorBoundary for better error handling
const DashboardPage = React.memo(() => {
  return (
    <ErrorBoundary>
      <DashboardPageContent />
    </ErrorBoundary>
  );
});

export default DashboardPage;

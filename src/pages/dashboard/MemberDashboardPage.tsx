
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { useNotifications } from "@/hooks/useNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Music, 
  Calendar, 
  Bell, 
  User, 
  Mic, 
  Users,
  Clock,
  FileText,
  CheckSquare,
  PlayCircle
} from "lucide-react";
import { findNextEvent, formatEventDate, formatEventTime } from "@/utils/calendarUtils";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";
import ErrorBoundary from "@/components/ErrorBoundary";

const MemberDashboardPage = () => {
  const { profile } = useAuth();
  const { events, loading: eventsLoading } = useCalendarEvents();
  const { allMediaFiles, loading: mediaLoading } = useMediaLibrary();
  const { unreadCount } = useNotifications();
  
  // Find the next upcoming event
  const nextEvent = findNextEvent(events, true);
  
  // Count sheet music files
  const sheetMusicCount = allMediaFiles.filter(file => 
    file.file_type === 'application/pdf' || 
    file.file_type.includes('pdf') ||
    file.folder === 'sheet-music'
  ).length;

  // Quick access buttons for most frequently used features
  const quickAccessButtons = [
    {
      title: "Sheet Music",
      description: "View and practice your music",
      icon: <Music className="h-8 w-8" />,
      href: "/dashboard/sheet-music",
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      badge: sheetMusicCount > 0 ? `${sheetMusicCount} pieces` : null
    },
    {
      title: "Announcements",
      description: "Latest updates and news",
      icon: <Bell className="h-8 w-8" />,
      href: "/dashboard/announcements",
      color: "bg-gradient-to-br from-amber-500 to-amber-700",
      badge: unreadCount > 0 ? `${unreadCount} new` : null
    },
    {
      title: "Next Event",
      description: nextEvent ? formatEventDate(nextEvent.start_time) : "No upcoming events",
      icon: <Calendar className="h-8 w-8" />,
      href: "/calendar",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      badge: nextEvent ? "Upcoming" : null
    },
    {
      title: "My Profile",
      description: "Update your information",
      icon: <User className="h-8 w-8" />,
      href: "/dashboard/profile",
      color: "bg-gradient-to-br from-green-500 to-green-700",
      badge: profile?.voice_part || null
    },
    {
      title: "Practice Studio",
      description: "Record and practice",
      icon: <Mic className="h-8 w-8" />,
      href: "/dashboard/recording-studio",
      color: "bg-gradient-to-br from-red-500 to-red-700",
      badge: "Record"
    },
    {
      title: "Attendance",
      description: "Check in for events",
      icon: <CheckSquare className="h-8 w-8" />,
      href: "/dashboard/attendance",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      badge: "Check-in"
    }
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Welcome Hero Section */}
        <div className="bg-gradient-to-r from-glee-spelman to-glee-spelman/80 text-white rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {profile?.first_name || 'Member'}!
              </h1>
              <p className="text-glee-spelman-light">
                {profile?.voice_part ? `${profile.voice_part.replace('_', ' ')} • ` : ''}
                Ready to make beautiful music together
              </p>
            </div>
            {nextEvent && (
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-sm opacity-90">Next Event</div>
                <div className="font-semibold">{nextEvent.title}</div>
                <div className="text-sm opacity-90">
                  {formatEventDate(nextEvent.start_time)} at {formatEventTime(nextEvent.start_time)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickAccessButtons.map((button, index) => (
              <Link key={index} to={button.href} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-0 overflow-hidden">
                  <div className={`${button.color} p-1`}>
                    <CardContent className="bg-white m-1 rounded p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`${button.color} text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                          {button.icon}
                        </div>
                        {button.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {button.badge}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-glee-spelman transition-colors">
                        {button.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {button.description}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Dashboard Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Announcements */}
          <DashboardAnnouncements />

          {/* Next Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Upcoming Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading event information...
                </div>
              ) : nextEvent ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{nextEvent.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatEventDate(nextEvent.start_time)} at {formatEventTime(nextEvent.start_time)}
                    </p>
                    {nextEvent.location_name && (
                      <p className="text-sm text-muted-foreground">
                        📍 {nextEvent.location_name}
                      </p>
                    )}
                  </div>
                  {nextEvent.short_description && (
                    <p className="text-sm">{nextEvent.short_description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link to="/calendar">View Details</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/dashboard/attendance">Check In</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No upcoming events scheduled</p>
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link to="/calendar">View Calendar</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources Section */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/dashboard/media-library" className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <FileText className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm font-medium">Media Library</span>
              </Link>
              <Link to="/dashboard/recordings" className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <PlayCircle className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm font-medium">Recordings</span>
              </Link>
              <Link to="/dashboard/members" className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Users className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-sm font-medium">Members</span>
              </Link>
              <Link to="/dashboard/archives" className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <FileText className="h-6 w-6 mb-2 text-orange-600" />
                <span className="text-sm font-medium">Archives</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default MemberDashboardPage;

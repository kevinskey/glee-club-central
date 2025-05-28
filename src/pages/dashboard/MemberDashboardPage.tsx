
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { useAuth } from "@/contexts/AuthContext";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Music, Calendar, Bell } from "lucide-react";
import { findNextEvent, formatEventDate, formatEventTime } from "@/utils/calendarUtils";
import ErrorBoundary from "@/components/ErrorBoundary";

const MemberDashboardPage = () => {
  const { profile } = useAuth();
  const { events, loading: eventsLoading } = useCalendarEvents();
  
  // Find the next upcoming event
  const nextEvent = findNextEvent(events, true); // Include private events for members
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <PageHeader
          title="Member Dashboard"
          description={`Welcome back, ${profile?.first_name || 'Member'} - Access your glee club resources and activities`}
        />

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voice Part</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.voice_part || 'Not Set'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Event</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : nextEvent ? (
                <>
                  <div className="text-2xl font-bold truncate">{nextEvent.title}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatEventDate(nextEvent.start_time)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatEventTime(nextEvent.start_time)}
                    {nextEvent.location_name && ` • ${nextEvent.location_name}`}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">No Events</div>
                  <p className="text-xs text-muted-foreground">No upcoming events scheduled</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sheet Music</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Available pieces</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">New this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Modules */}
        <DashboardModules />
      </div>
    </ErrorBoundary>
  );
};

export default MemberDashboardPage;

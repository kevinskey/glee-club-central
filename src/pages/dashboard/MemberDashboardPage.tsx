
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardQuickAccess } from "@/components/dashboard/DashboardQuickAccess";
import { UpcomingEventsList } from "@/components/calendar/UpcomingEventsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Music, Bell } from "lucide-react";

export default function MemberDashboardPage() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${profile?.first_name || 'Member'}!`}
        description="Access your Glee Club resources and stay up to date"
      />

      {/* Quick Access - Main feature for members */}
      <DashboardQuickAccess />

      {/* Additional member-specific content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingEventsList limit={3} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-md">
                <h4 className="font-medium text-sm">Spring Concert Rehearsal</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Don't forget to bring your sheet music for tomorrow's rehearsal.
                </p>
                <p className="text-xs mt-2">May 20, 2025</p>
              </div>
              <div className="p-3 border rounded-md">
                <h4 className="font-medium text-sm">New Practice Tracks Available</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Practice tracks for "Ave Maria" have been uploaded to the recordings section.
                </p>
                <p className="text-xs mt-2">May 18, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="mr-2 h-5 w-5" />
            Recently Added Music
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <h4 className="font-medium text-sm">Ave Maria</h4>
              <p className="text-xs text-muted-foreground">Soprano 1 & 2</p>
            </div>
            <div className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <h4 className="font-medium text-sm">Amazing Grace</h4>
              <p className="text-xs text-muted-foreground">All Parts</p>
            </div>
            <div className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <h4 className="font-medium text-sm">Swing Low</h4>
              <p className="text-xs text-muted-foreground">Alto 1 & 2</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

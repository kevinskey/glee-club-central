
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardModules } from "@/components/dashboard/DashboardModules";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Music, Calendar, Bell } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";

const MemberDashboardPage = () => {
  const { profile } = useAuth();
  
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
              <div className="text-2xl font-bold">Spring Concert</div>
              <p className="text-xs text-muted-foreground">May 15, 2025</p>
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

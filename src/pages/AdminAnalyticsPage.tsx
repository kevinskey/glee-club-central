import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  LineChart, 
  Users, 
  Calendar, 
  TrendingUp, 
  Music,
  DollarSign,
  Award
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { Badge } from '@/components/ui/badge';
import { hasPermission } from '@/utils/permissionChecker';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  eventsThisMonth: number;
  attendanceRate: number;
  monthlyGrowth: number;
  revenueThisMonth: number;
}

export default function AdminAnalyticsPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuthMigration();
  const { user, profile } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdminUser = isAdmin();
  
  // Create user object for permission checking
  const currentUser = {
    ...user,
    role_tags: profile?.role_tags || []
  };
  
  // Check if user has permission to view budget/analytics
  const canViewAnalytics = isAdminUser || hasPermission(currentUser, 'view_budget');

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true);
      // Mock data - in real app this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData({
        totalMembers: 45,
        activeMembers: 42,
        eventsThisMonth: 8,
        attendanceRate: 87.5,
        monthlyGrowth: 5.2,
        revenueThisMonth: 2250
      });
      setLoading(false);
    };

    if (isAuthenticated && canViewAnalytics) {
      loadAnalytics();
    }
  }, [isAuthenticated, canViewAnalytics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !canViewAnalytics) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You don't have permission to view analytics data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Overview of choir performance and member statistics"
        icon={<BarChart className="h-6 w-6" />}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analyticsData ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalMembers}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.activeMembers} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.eventsThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  +{analyticsData.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Above target of 85%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analyticsData.revenueThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Growth</CardTitle>
                <CardDescription>
                  Member count over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Attendance</CardTitle>
                <CardDescription>
                  Attendance by event type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground">
              Analytics data could not be loaded at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

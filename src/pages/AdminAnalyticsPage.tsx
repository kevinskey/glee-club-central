
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Clock,
  TrendingUp,
  Eye,
  MousePointer,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { Badge } from '@/components/ui/badge';

export default function AdminAnalyticsPage() {
  const { metrics, isLoading } = useAnalyticsData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics Dashboard"
          description="Track app usage and user engagement metrics"
          icon={<BarChart3 className="h-6 w-6" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics Dashboard"
          description="Track app usage and user engagement metrics"
          icon={<BarChart3 className="h-6 w-6" />}
        />
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground">
              Start using the app to generate analytics data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getChangeIndicator = (value: number, isPositive: boolean = true) => {
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    return (
      <div className={`flex items-center text-sm ${colorClass}`}>
        <Icon className="h-3 w-3 mr-1" />
        {Math.abs(value)}%
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Track app usage and user engagement metrics"
        icon={<BarChart3 className="h-6 w-6" />}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glee-spelman">{metrics.totalUsers}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">All registered users</p>
              {getChangeIndicator(12.5)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glee-spelman">{metrics.dailyActiveUsers}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
              {getChangeIndicator(8.2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glee-spelman">{metrics.totalSessions}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">All time</p>
              {getChangeIndicator(15.7)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glee-spelman">{metrics.avgSessionDuration}m</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Average minutes</p>
              {getChangeIndicator(4.1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.weeklyActiveUsers}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.monthlyActiveUsers}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">Single page visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Key actions completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="User Growth (Last 30 Days)"
          data={metrics.userGrowth}
          type="line"
          dataKey="users"
          xAxisKey="date"
          color="#f97316"
        />

        <AnalyticsChart
          title="Top Pages by Views"
          data={metrics.topPages.slice(0, 8)}
          type="bar"
          dataKey="views"
          xAxisKey="page"
          color="#3b82f6"
        />
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Most Visited Pages
            </CardTitle>
            <CardDescription>
              Pages with the highest view counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topPages.slice(0, 5).map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium truncate max-w-[200px]">
                      {page.page === '/' ? 'Home' : page.page.replace('/', '')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {page.views} views
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Most Used Features
            </CardTitle>
            <CardDescription>
              Features with the highest usage rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topFeatures.slice(0, 5).map((feature, index) => (
                <div key={feature.feature} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium capitalize">
                      {feature.feature.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {feature.usage} uses
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

const AnalyticsPage = () => {
  const analyticsStats = [
    {
      title: 'Page Views',
      value: '12,345',
      icon: BarChart3,
      change: '+12% this week',
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: '1,234',
      icon: Users,
      change: '+5% this month',
      color: 'text-green-600'
    },
    {
      title: 'Engagement Rate',
      value: '78.5%',
      icon: TrendingUp,
      change: '+8% this week',
      color: 'text-purple-600'
    },
    {
      title: 'Session Duration',
      value: '4m 32s',
      icon: Activity,
      change: '+15% this month',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-navy-900 dark:text-white font-playfair">
          Analytics Dashboard
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Analytics
        </Badge>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {analyticsStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                <CardTitle className="text-xs font-medium text-gray-900 dark:text-white">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-2">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Usage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Detailed analytics charts and reports will be displayed here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Performance insights and optimization recommendations.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;

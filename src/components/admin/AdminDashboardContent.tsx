
import React from 'react';
import { UnifiedAdminModules } from './UnifiedAdminModules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';

export function AdminDashboardContent() {
  const { profile } = useAuth();

  const quickStats = [
    {
      title: 'Total Members',
      value: '42',
      icon: Users,
      change: '+3 this month',
      color: 'text-blue-600'
    },
    {
      title: 'Upcoming Events',
      value: '8',
      icon: Calendar,
      change: '2 this week',
      color: 'text-green-600'
    },
    {
      title: 'Analytics Views',
      value: '1,234',
      icon: BarChart3,
      change: '+12% this week',
      color: 'text-purple-600'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: Settings,
      change: 'All systems operational',
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="w-full space-y-0">
        {/* Admin Modules - moved to top */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Administration</h2>
              <p className="text-muted-foreground text-sm">
                Manage all aspects of your Glee Club
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Admin Access
            </Badge>
          </div>
          
          <UnifiedAdminModules />
        </div>

        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {profile?.first_name || 'Admin'}! 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's what's happening with your Glee Club today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-0 m-0 rounded-none border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 m-0">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent className="p-0 m-0">
                  <div className="text-xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

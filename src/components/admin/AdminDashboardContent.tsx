
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
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-playfair mb-2">
          Welcome back, {profile?.first_name || 'Admin'}! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Here's what's happening with your Glee Club today.
        </p>
      </div>

      {/* Admin Modules */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-playfair">Administration</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage all aspects of your Glee Club
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Admin Access
          </Badge>
        </div>
        
        <UnifiedAdminModules />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

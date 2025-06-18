
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
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Admin Modules - moved to top */}
        <div className="glass-card p-6 rounded-2xl animate-glass-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-headline text-foreground font-playfair">Administration</h2>
              <p className="text-body text-muted-foreground mt-1">
                Manage all aspects of your Glee Club
              </p>
            </div>
            <Badge variant="outline" className="glass-button px-3 py-1 text-xs border-[#0072CE]/30">
              Admin Access
            </Badge>
          </div>
          
          <UnifiedAdminModules />
        </div>

        {/* Welcome Section */}
        <div className="glass-card p-6 rounded-2xl animate-glass-fade-in">
          <h1 className="text-display bg-gradient-to-r from-[#0072CE] to-[#0072CE]/80 bg-clip-text text-transparent font-playfair">
            Welcome back, {profile?.first_name || 'Admin'}! 👋
          </h1>
          <p className="text-subhead text-muted-foreground mt-2">
            Here's what's happening with your Glee Club today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-card glass-hover rounded-2xl border-white/20 animate-glass-scale" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-caption font-medium text-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-headline font-bold text-foreground">{stat.value}</div>
                  <p className="text-caption text-muted-foreground mt-1">
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

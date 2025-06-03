
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { 
  Users, 
  Calendar, 
  Upload, 
  Music, 
  Bell,
  BarChart3,
  FileImage,
  Settings,
  ShoppingBag,
  ImageIcon
} from 'lucide-react';

export function MobileAdminDashboard() {
  const navigate = useNavigate();
  const { mediaStats, isLoading } = useMediaLibrary();

  const quickActions = [
    {
      title: 'Users',
      description: 'Manage members',
      icon: Users,
      path: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Calendar',
      description: 'Events & rehearsals',
      icon: Calendar,
      path: '/admin/calendar',
      color: 'bg-green-500'
    },
    {
      title: 'Store',
      description: 'Manage products',
      icon: ShoppingBag,
      path: '/admin/store',
      color: 'bg-emerald-500'
    },
    {
      title: 'Hero',
      description: 'Edit homepage',
      icon: ImageIcon,
      path: '/admin/hero-manager',
      color: 'bg-purple-500'
    },
    {
      title: 'Media',
      description: 'Upload files',
      icon: Upload,
      path: '/admin/media-library',
      color: 'bg-orange-500'
    },
    {
      title: 'Music',
      description: 'Sheet music',
      icon: Music,
      path: '/admin/media-library',
      color: 'bg-indigo-500'
    },
    {
      title: 'News',
      description: 'Send notifications',
      icon: Bell,
      path: '/admin/news-items',
      color: 'bg-red-500'
    },
    {
      title: 'Analytics',
      description: 'View reports',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'bg-cyan-500'
    },
    {
      title: 'Settings',
      description: 'System config',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  const stats = [
    {
      label: 'Total Files',
      value: isLoading ? '...' : mediaStats?.totalFiles?.toString() || '0',
      icon: FileImage
    },
    {
      label: 'Images',
      value: isLoading ? '...' : (mediaStats?.filesByType?.['image'] || 0).toString(),
      icon: FileImage
    },
    {
      label: 'Documents',
      value: isLoading ? '...' : (mediaStats?.filesByType?.['pdf'] || 0).toString(),
      icon: FileImage
    },
    {
      label: 'Audio/Video',
      value: isLoading ? '...' : ((mediaStats?.filesByType?.['audio'] || 0) + (mediaStats?.filesByType?.['video'] || 0)).toString(),
      icon: Music
    }
  ];

  return (
    <div className="dashboard-mobile-container p-4 space-y-6">
      {/* Header */}
      <div className="dashboard-mobile-section">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your Glee Club
        </p>
      </div>

      {/* Stats */}
      <div className="dashboard-mobile-section">
        <div className="dashboard-mobile-stats grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="dashboard-mobile-stat-card bg-card border rounded-lg p-4 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="dashboard-mobile-stat-value text-2xl font-bold text-primary">{stat.value}</div>
              <div className="dashboard-mobile-stat-label text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-mobile-section">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="dashboard-mobile-card cursor-pointer hover:shadow-md transition-shadow border"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mx-auto mb-3`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-mobile-section">
        <Card className="dashboard-mobile-card border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    New member registered
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Media file uploaded
                  </p>
                  <p className="text-xs text-muted-foreground">
                    4 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Event created
                  </p>
                  <p className="text-xs text-muted-foreground">
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


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
    }
  ];

  return (
    <div className="w-full max-w-full p-3 space-y-3 overflow-x-hidden">
      {/* Header */}
      <div className="w-full">
        <h1 className="text-xl font-bold text-foreground mb-1">
          Admin Dashboard
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage your Glee Club
        </p>
      </div>

      {/* Stats */}
      <div className="w-full">
        <div className="grid grid-cols-2 gap-2 w-full">
          {stats.map((stat, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-2 text-center">
                <stat.icon className="h-4 w-4 mx-auto mb-1 text-primary" />
                <div className="text-sm font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="w-full">
        <h2 className="text-sm font-semibold text-foreground mb-2">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2 w-full">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="w-full cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-2 text-center">
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white mx-auto mb-1`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-foreground mb-1">
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
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MobileOptimizedContainer } from '@/components/mobile/MobileOptimizedContainer';
import { MobileCardGrid } from '@/components/mobile/MobileCardGrid';
import { MobileResponsiveText } from '@/components/mobile/MobileResponsiveText';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { 
  Users, 
  Calendar, 
  Upload, 
  Music, 
  Bell,
  BarChart3,
  FileImage,
  Settings
} from 'lucide-react';

export function MobileAdminDashboard() {
  const navigate = useNavigate();
  const { mediaStats, isLoading } = useMediaLibrary();

  const quickActions = [
    {
      title: 'Members',
      description: 'Manage users',
      icon: Users,
      path: '/admin/members',
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
      title: 'Media',
      description: 'Upload files',
      icon: Upload,
      path: '/admin/media',
      color: 'bg-purple-500'
    },
    {
      title: 'Music',
      description: 'Sheet music',
      icon: Music,
      path: '/admin/media-uploader',
      color: 'bg-orange-500'
    },
    {
      title: 'Announce',
      description: 'Send notifications',
      icon: Bell,
      path: '/admin/announcements',
      color: 'bg-red-500'
    },
    {
      title: 'Analytics',
      description: 'View reports',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'bg-cyan-500'
    }
  ];

  const stats = [
    {
      label: 'Total Files',
      value: mediaStats.totalFiles.toString(),
      icon: FileImage
    },
    {
      label: 'Images',
      value: (mediaStats.filesByType?.['image'] || 0).toString(),
      icon: FileImage
    },
    {
      label: 'Documents',
      value: (mediaStats.filesByType?.['pdf'] || 0).toString(),
      icon: FileImage
    },
    {
      label: 'Audio/Video',
      value: ((mediaStats.filesByType?.['audio'] || 0) + (mediaStats.filesByType?.['video'] || 0)).toString(),
      icon: Music
    }
  ];

  return (
    <MobileOptimizedContainer className="dashboard-mobile-container">
      {/* Header */}
      <div className="dashboard-mobile-section">
        <MobileResponsiveText as="h1" size="2xl" weight="bold" className="mb-2">
          Admin Dashboard
        </MobileResponsiveText>
        <MobileResponsiveText size="sm" className="text-muted-foreground">
          Manage your Glee Club
        </MobileResponsiveText>
      </div>

      {/* Stats */}
      <div className="dashboard-mobile-section">
        <div className="dashboard-mobile-stats">
          {stats.map((stat, index) => (
            <div key={index} className="dashboard-mobile-stat-card">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="dashboard-mobile-stat-value">{stat.value}</div>
              <div className="dashboard-mobile-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-mobile-section">
        <MobileResponsiveText as="h2" size="lg" weight="semibold" className="mb-4">
          Quick Actions
        </MobileResponsiveText>
        <MobileCardGrid columns={2} gap="sm">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="dashboard-mobile-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mx-auto mb-3`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <MobileResponsiveText size="sm" weight="medium" className="mb-1">
                  {action.title}
                </MobileResponsiveText>
                <MobileResponsiveText size="xs" className="text-muted-foreground">
                  {action.description}
                </MobileResponsiveText>
              </CardContent>
            </Card>
          ))}
        </MobileCardGrid>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-mobile-section">
        <Card className="dashboard-mobile-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <MobileResponsiveText size="sm" weight="medium">
                    New member registered
                  </MobileResponsiveText>
                  <MobileResponsiveText size="xs" className="text-muted-foreground">
                    2 hours ago
                  </MobileResponsiveText>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <MobileResponsiveText size="sm" weight="medium">
                    Media file uploaded
                  </MobileResponsiveText>
                  <MobileResponsiveText size="xs" className="text-muted-foreground">
                    4 hours ago
                  </MobileResponsiveText>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <MobileResponsiveText size="sm" weight="medium">
                    Event created
                  </MobileResponsiveText>
                  <MobileResponsiveText size="xs" className="text-muted-foreground">
                    1 day ago
                  </MobileResponsiveText>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileOptimizedContainer>
  );
}

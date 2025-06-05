import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { 
  Calendar, Users, Music, Store, MessageSquare, Camera, 
  Settings, BarChart3, Clock, Bell, FileText, Mic 
} from 'lucide-react';

interface AdminModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  status: 'ready' | 'beta' | 'coming-soon';
  category: 'core' | 'tools' | 'communication' | 'analytics';
}

export default function AdminDashboardV2() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const modules: AdminModule[] = [
    // Core Modules
    {
      id: 'calendar-events',
      title: 'Calendar & Events',
      description: 'Manage rehearsals, performances, and member RSVPs',
      icon: <Calendar className="h-5 w-5" />,
      path: '/admin/calendar-v2',
      status: 'ready',
      category: 'core'
    },
    {
      id: 'member-dashboard',
      title: 'Member Management',
      description: 'Profiles, roles, dues, and member assignments',
      icon: <Users className="h-5 w-5" />,
      path: '/admin/members-v2',
      status: 'ready',
      category: 'core'
    },
    {
      id: 'sheet-music',
      title: 'Sheet Music Library',
      description: 'Upload, organize, and manage choir sheet music',
      icon: <FileText className="h-5 w-5" />,
      path: '/admin/sheet-music-v2',
      status: 'ready',
      category: 'core'
    },
    
    // Tools
    {
      id: 'music-studio',
      title: 'Music Studio',
      description: 'Practice tools, recording booth, and audio library',
      icon: <Mic className="h-5 w-5" />,
      path: '/admin/music-studio-v2',
      status: 'ready',
      category: 'tools'
    },
    {
      id: 'store-merch',
      title: 'Store & Merch',
      description: 'Product management and tour inventory',
      icon: <Store className="h-5 w-5" />,
      path: '/admin/store-v2',
      status: 'ready',
      category: 'tools'
    },
    {
      id: 'media-library',
      title: 'Media Library',
      description: 'Photos, videos, and digital assets',
      icon: <Camera className="h-5 w-5" />,
      path: '/admin/media-v2',
      status: 'ready',
      category: 'tools'
    },
    
    // Communication
    {
      id: 'communication',
      title: 'Communication Center',
      description: 'Announcements, email campaigns, and SMS',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/admin/communication-v2',
      status: 'beta',
      category: 'communication'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Push notifications and alerts',
      icon: <Bell className="h-5 w-5" />,
      path: '/admin/notifications-v2',
      status: 'coming-soon',
      category: 'communication'
    },
    
    // Analytics
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Attendance, engagement, and performance metrics',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/admin/analytics-v2',
      status: 'beta',
      category: 'analytics'
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure AI, integrations, and permissions',
      icon: <Settings className="h-5 w-5" />,
      path: '/admin/settings-v2',
      status: 'ready',
      category: 'analytics'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500';
      case 'beta': return 'bg-yellow-500';
      case 'coming-soon': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, AdminModule[]>);

  const categoryLabels = {
    core: 'Core Modules',
    tools: 'Tools & Resources',
    communication: 'Communication',
    analytics: 'Analytics & Settings'
  };

  return (
    <AdminV2Layout>
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          GleeWorld Admin Suite v2
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Complete management system for Spelman College Glee Club
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
            Welcome back, {profile?.first_name || 'Admin'}
          </Badge>
          <Badge variant="outline">
            {modules.filter(m => m.status === 'ready').length} Ready
          </Badge>
          <Badge variant="outline">
            {modules.filter(m => m.status === 'beta').length} Beta
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
                <p className="text-2xl font-bold">85</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Events</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sheet Music</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Music className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Products</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Store className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Categories */}
      {Object.entries(groupedModules).map(([category, categoryModules]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryModules.map((module) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(module.status)}`} />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={module.status === 'ready' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {module.status === 'ready' && 'Ready'}
                      {module.status === 'beta' && 'Beta'}
                      {module.status === 'coming-soon' && 'Coming Soon'}
                    </Badge>
                    
                    <Button 
                      size="sm"
                      onClick={() => navigate(module.path)}
                      disabled={module.status === 'coming-soon'}
                    >
                      {module.status === 'coming-soon' ? 'Coming Soon' : 'Open'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* AI Integration Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🤖 AI-Powered Assistant
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                AI assistance is available throughout the admin suite for content generation, 
                scheduling suggestions, and data insights.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/settings-v2')}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Configure AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminV2Layout>
  );
}

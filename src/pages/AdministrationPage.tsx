
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  BarChart, 
  Settings, 
  Music, 
  DollarSign,
  Shield,
  Bell,
  Presentation
} from 'lucide-react';

export default function AdministrationPage() {
  const { isLoading } = useAuthMigration();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading administration panel...</p>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      title: 'Member Management',
      description: 'Manage choir members, roles, and permissions',
      icon: <Users className="h-8 w-8" />,
      href: '/admin/members',
      color: 'bg-blue-500'
    },
    {
      title: 'Hero Slides Manager',
      description: 'Manage homepage hero slides and banners',
      icon: <Presentation className="h-8 w-8" />,
      href: '/admin/hero-slides',
      color: 'bg-blue-500'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View performance metrics and statistics',
      icon: <BarChart className="h-8 w-8" />,
      href: '/admin/analytics',
      color: 'bg-green-500'
    },
    {
      title: 'Financial Management',
      description: 'Track dues, expenses, and revenue',
      icon: <DollarSign className="h-8 w-8" />,
      href: '/admin/finances',
      color: 'bg-yellow-500'
    },
    {
      title: 'Calendar Management',
      description: 'Manage events, rehearsals, and performances',
      icon: <Calendar className="h-8 w-8" />,
      href: '/admin/calendar',
      color: 'bg-purple-500'
    },
    {
      title: 'Music Library',
      description: 'Manage sheet music and audio files',
      icon: <Music className="h-8 w-8" />,
      href: '/admin/music',
      color: 'bg-pink-500'
    },
    {
      title: 'Announcements',
      description: 'Create and manage choir announcements',
      icon: <Bell className="h-8 w-8" />,
      href: '/admin/announcements',
      color: 'bg-red-500'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings and preferences',
      icon: <Settings className="h-8 w-8" />,
      href: '/admin/settings',
      color: 'bg-gray-500'
    },
    {
      title: 'Security & Permissions',
      description: 'Manage user roles and access permissions',
      icon: <Shield className="h-8 w-8" />,
      href: '/admin/security',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground">
          Manage all aspects of the Spelman Glee Club
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => (
          <Card key={module.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                {module.icon}
              </div>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to={module.href}>
                  Access Module
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

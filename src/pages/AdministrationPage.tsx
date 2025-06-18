
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
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0072CE] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading administration panel...</p>
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
    <div className="p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-playfair mb-2">
          Administration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Manage all aspects of the Spelman Glee Club
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Card key={module.href} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 ${module.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                {module.icon}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-playfair">{module.title}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild className="w-full bg-[#0072CE] hover:bg-[#0072CE]/90 text-white">
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

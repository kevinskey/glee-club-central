
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
        <div className="text-center glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0072CE] mx-auto mb-4"></div>
          <p className="text-body text-muted-foreground">Loading administration panel...</p>
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
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-6 space-y-8">
      <div className="glass-card p-4 sm:p-6 rounded-2xl animate-glass-fade-in">
        <h1 className="text-display bg-gradient-to-r from-[#0072CE] to-[#0072CE]/80 bg-clip-text text-transparent font-playfair">
          Administration
        </h1>
        <p className="text-subhead text-muted-foreground mt-2">
          Manage all aspects of the Spelman Glee Club
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Card key={module.href} className="glass-card glass-hover rounded-2xl border-white/20 animate-glass-scale" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 ${module.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                {module.icon}
              </div>
              <CardTitle className="text-subhead font-playfair text-foreground">{module.title}</CardTitle>
              <CardDescription className="text-body text-muted-foreground">{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild className="w-full glass-button-primary rounded-xl">
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

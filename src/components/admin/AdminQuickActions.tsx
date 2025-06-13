
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Calendar, Image, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminQuickActions() {
  const quickActions = [
    {
      title: 'Add Member',
      description: 'Add a new member to the club',
      icon: Users,
      href: '/admin/members',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Event',
      description: 'Schedule a new rehearsal or performance',
      icon: Calendar,
      href: '/admin/calendar',
      color: 'bg-green-500'
    },
    {
      title: 'Manage Hero Slides',
      description: 'Update homepage slideshow content',
      icon: Image,
      href: '/admin/hero-slides',
      color: 'bg-purple-500'
    },
    {
      title: 'Music Player',
      description: 'Manage playlists and player settings',
      icon: Music,
      href: '/admin/music',
      color: 'bg-orange-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className={`p-2 rounded-md ${action.color} text-white`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

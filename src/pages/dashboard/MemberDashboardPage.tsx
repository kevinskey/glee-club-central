
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Music, Bell, User, BookOpen, Headphones } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NextEventCountdown } from '@/components/dashboard/NextEventCountdown';
import { UpcomingEventsList } from '@/components/calendar/UpcomingEventsList';
import { Button } from '@/components/ui/button';
import { QuickAccess } from '@/components/dashboard/QuickAccess';

interface QuickAccessTile {
  title: string;
  icon: string;
  href: string;
  color: string;
}

export default function MemberDashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Quick access tiles for members
  const memberTiles: QuickAccessTile[] = [
    {
      title: "Sheet Music",
      icon: "Music",
      href: "/dashboard/sheet-music",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Calendar",
      icon: "Calendar",
      href: "/dashboard/calendar",
      color: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
    {
      title: "Recordings",
      icon: "Headphones",
      href: "/dashboard/recordings",
      color: "bg-gradient-to-br from-amber-500 to-amber-600"
    },
    {
      title: "Resources",
      icon: "BookOpen",
      href: "/dashboard/resources",
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Announcements",
      icon: "Bell",
      href: "/dashboard/announcements",
      color: "bg-gradient-to-br from-red-500 to-red-600"
    },
    {
      title: "Profile",
      icon: "User",
      href: "/dashboard/profile",
      color: "bg-gradient-to-br from-gray-600 to-gray-700"
    }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.first_name || 'Member'}`}
        description="Your Spelman College Glee Club member dashboard"
      />

      <QuickAccess tiles={memberTiles} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Content - Left 2/3 */}
        <div className="md:col-span-8 space-y-6">
          {/* Next Rehearsal Countdown */}
          <NextEventCountdown />
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  <CardTitle>Upcoming Events</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/dashboard/calendar')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <UpcomingEventsList limit={4} />
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar - Right 1/3 */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="text-center p-6 text-muted-foreground">
              <Bell className="mx-auto mb-2 h-12 w-12 opacity-20" />
              <p>No new announcements</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full text-left justify-start" asChild>
                <a href="/dashboard/sheet-music">
                  <Music className="mr-2 h-4 w-4" />
                  Access Sheet Music
                </a>
              </Button>
              <Button variant="outline" className="w-full text-left justify-start" asChild>
                <a href="/dashboard/recordings">
                  <Headphones className="mr-2 h-4 w-4" />
                  Practice Recordings
                </a>
              </Button>
              <Button variant="outline" className="w-full text-left justify-start" asChild>
                <a href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

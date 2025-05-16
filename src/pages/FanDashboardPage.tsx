
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpcomingEventsList } from "@/components/calendar/UpcomingEventsList";
import { Calendar, Music, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuickAccess } from "@/components/dashboard/QuickAccess";

export default function FanDashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Quick access tiles for fans
  const fanTiles = [
    {
      title: "Calendar",
      icon: "Calendar",
      href: "/dashboard/calendar",
      color: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      title: "Announcements",
      icon: "Bell",
      href: "/dashboard/announcements",
      color: "bg-gradient-to-br from-amber-500 to-amber-700"
    },
    {
      title: "My Profile",
      icon: "User",
      href: "/dashboard/profile",
      color: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.first_name || 'Fan'}`}
        description="Your Spelman College Glee Club fan dashboard"
      />
      
      {/* Quick Access Grid */}
      <QuickAccess tiles={fanTiles} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-glee-spelman" />
                <CardTitle>Upcoming Performances</CardTitle>
              </div>
              <Button 
                variant="link" 
                onClick={() => navigate('/dashboard/calendar')}
                className="text-glee-spelman"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <UpcomingEventsList 
                maxItems={3} 
                showType="performance" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-glee-spelman" />
                <CardTitle>Latest Announcements</CardTitle>
              </div>
              <Button 
                variant="link" 
                onClick={() => navigate('/dashboard/announcements')}
                className="text-glee-spelman"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center text-muted-foreground">
                Stay tuned for upcoming announcements!
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Content */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button className="w-full" variant="outline">
                  <Music className="mr-2 h-4 w-4" />
                  Join Our Mailing List
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Add Concerts to Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

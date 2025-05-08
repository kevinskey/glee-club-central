
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Music, Calendar, Bell, FileText, Clock, UsersRound, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { profile } = useAuth();
  
  // Mock data for dashboard components
  const upcomingEvents = [
    { id: 1, name: "Weekly Rehearsal", date: "Today", time: "6:00 PM - 8:00 PM", location: "Music Hall" },
    { id: 2, name: "Spring Concert", date: "May 15, 2025", time: "7:00 PM - 9:00 PM", location: "Spelman Auditorium" },
    { id: 3, name: "Sectional Practice", date: "May 10, 2025", time: "3:00 PM - 4:30 PM", location: "Practice Room B" }
  ];
  
  const announcements = [
    { id: 1, title: "Sheet Music Update", message: "New arrangements for the Spring Concert are now available in the Sheet Music section.", date: "2 days ago" },
    { id: 2, title: "Wardrobe Reminder", message: "Remember to pick up your performance attire by May 8th.", date: "3 days ago" }
  ];
  
  const practiceItems = [
    { id: 1, name: "Amazing Grace", progress: 85 },
    { id: 2, name: "Wade in the Water", progress: 60 },
    { id: 3, name: "Lift Every Voice", progress: 40 }
  ];

  return (
    <div className="container mx-auto px-4 pb-8">
      <PageHeader
        title={`Welcome, ${profile?.first_name || 'Member'}`}
        description="Your Glee Club dashboard"
        icon={<LayoutDashboard className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Events Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
              <CardDescription>Your scheduled rehearsals and performances</CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="border-b pb-3 last:border-0">
                  <h4 className="font-medium">{event.name}</h4>
                  <div className="text-sm text-muted-foreground mt-1 space-y-1">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <UsersRound className="h-3.5 w-3.5 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link 
                to="/dashboard/calendar" 
                className="text-sm font-medium text-primary hover:underline"
              >
                View full calendar
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Announcements</CardTitle>
              <CardDescription>Recent updates</CardDescription>
            </div>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className="border-b pb-3 last:border-0">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{announcement.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Practice Progress Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Practice Progress</CardTitle>
              <CardDescription>Your current repertoire</CardDescription>
            </div>
            <Music className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {practiceItems.map(item => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link 
                to="/dashboard/practice" 
                className="text-sm font-medium text-primary hover:underline"
              >
                Go to practice
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sheet Music Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Sheet Music</CardTitle>
              <CardDescription>Access your music library</CardDescription>
            </div>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and download all your sheet music for upcoming performances and rehearsals.
            </p>
            <Link 
              to="/dashboard/sheet-music" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full"
            >
              Browse Sheet Music
            </Link>
          </CardContent>
        </Card>

        {/* Quick Links Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Quick Access</CardTitle>
              <CardDescription>Useful resources</CardDescription>
            </div>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Link 
                to="/dashboard/recordings" 
                className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors"
              >
                <Music className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Recordings</span>
              </Link>
              <Link 
                to="/dashboard/attendance" 
                className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors"
              >
                <UsersRound className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Attendance</span>
              </Link>
              <Link 
                to="/dashboard/performance-checklist" 
                className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors"
              >
                <FileText className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Checklist</span>
              </Link>
              <Link 
                to="/dashboard/handbook" 
                className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors"
              >
                <Bell className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Handbook</span>
              </Link>
              <Link 
                to="/dashboard/profile" 
                className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors"
              >
                <UsersRound className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Profile</span>
              </Link>
              <Link 
                to="/dashboard/videos" 
                className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-accent transition-colors"
              >
                <Bell className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">Videos</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

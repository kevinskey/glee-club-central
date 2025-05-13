
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { QuickAccess } from "@/components/dashboard/QuickAccess";
import { NextEventCountdown } from "@/components/dashboard/NextEventCountdown";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";
import { RehearsalNotes } from "@/components/dashboard/RehearsalNotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { DuesStatusCard } from "@/components/dashboard/DuesStatusCard";

export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
}

export default function MemberDashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Sample next event for the countdown
  const nextEvent = {
    id: "next-event",
    title: "Weekly Rehearsal",
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    time: "6:00 PM",
    location: "Fine Arts Building"
  };
  
  // Quick access tiles
  const quickAccessTiles = [
    {
      title: "Sheet Music",
      icon: "Music",
      href: "/dashboard/sheet-music",
      color: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
    {
      title: "Calendar",
      icon: "Calendar",
      href: "/dashboard/calendar",
      color: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      title: "Practice Resources",
      icon: "Headphones",
      href: "/dashboard/practice",
      color: "bg-gradient-to-br from-green-500 to-green-700"
    },
    {
      title: "My Profile",
      icon: "User",
      href: "/dashboard/profile",
      color: "bg-gradient-to-br from-amber-500 to-amber-700"
    }
  ];
  
  // Sample events
  const events = [
    {
      id: "event-1",
      title: "Spring Concert",
      date: new Date(Date.now() + 86400000 * 7), // 7 days from now
      time: "7:00 PM",
      location: "Sisters Chapel"
    },
    {
      id: "event-2",
      title: "Sectional Rehearsal",
      date: new Date(Date.now() + 86400000 * 3), // 3 days from now
      time: "4:00 PM",
      location: "Practice Room 101"
    },
    {
      id: "event-3",
      title: "Tour Preparation Meeting",
      date: new Date(Date.now() + 86400000 * 14), // 14 days from now
      time: "5:30 PM",
      location: "Conference Room"
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.first_name || 'Member'}`}
        description="Your Spelman College Glee Club member dashboard"
      />
      
      {/* Quick Access Grid */}
      <QuickAccess />
      
      {/* Next Event Countdown */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Next Performance</h2>
        <NextEventCountdown event={nextEvent} />
      </div>
      
      {/* Dashboard Content in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Column 1 - Main Content */}
        <div className="md:col-span-8 space-y-6">
          {/* Upcoming Events */}
          <Card className="shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-glee-spelman" />
                <CardTitle>Upcoming Events</CardTitle>
              </div>
              <Link to="/dashboard/calendar" className="text-sm text-glee-spelman hover:underline">
                View Calendar
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event, index) => (
                  <div key={index} className="flex items-start border-b last:border-0 pb-3 last:pb-0">
                    <div className="bg-muted text-center p-2 rounded-md min-w-[60px]">
                      <div className="text-xs font-medium text-muted-foreground">
                        {event.date.toLocaleDateString(undefined, { month: 'short' })}
                      </div>
                      <div className="text-lg font-bold">{event.date.getDate()}</div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" /> {event.time}
                        {event.location && <span>• {event.location}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Rehearsal Notes */}
          <RehearsalNotes />
          
          {/* Announcements */}
          <DashboardAnnouncements />
        </div>
        
        {/* Column 2 - Side Content */}
        <div className="md:col-span-4 space-y-6">
          {/* Dues Status Card */}
          <DuesStatusCard />
        </div>
      </div>
    </div>
  );
}

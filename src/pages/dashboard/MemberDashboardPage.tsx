
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/contexts/AuthContext";
import { UpcomingEventsList } from "@/components/calendar/UpcomingEventsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as RouterLink } from "react-router-dom";
import { Calendar, Music, Bell } from "lucide-react";
import {
  Music as MusicIcon,
  Calendar as CalendarIcon,
  MessageSquare,
  DollarSign,
  Bell as BellIcon,
  Upload,
  Settings
} from "lucide-react";

export default function MemberDashboardPage() {
  const { profile } = useAuth();

  // Custom quick access items for members
  const memberQuickAccessLinks = [
    { icon: MusicIcon, title: "Sheet Music", path: "/dashboard/sheet-music", color: "bg-purple-500" },
    { icon: CalendarIcon, title: "Calendar", path: "/dashboard/calendar", color: "bg-green-500" },
    { icon: MessageSquare, title: "Messaging", path: "/dashboard/messaging", color: "bg-blue-500" },
    { icon: DollarSign, title: "Finance", path: "/dashboard/finances", color: "bg-emerald-500" },
    { icon: BellIcon, title: "Announcements", path: "/dashboard/announcements", color: "bg-red-500" },
    { icon: Upload, title: "Media Manager", path: "/dashboard/media-library", color: "bg-pink-500" },
    { icon: Settings, title: "Settings", path: "/dashboard/settings", color: "bg-gray-500" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${profile?.first_name || 'Member'}!`}
        description="Access your Glee Club resources and stay up to date"
      />

      {/* Quick Access Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {memberQuickAccessLinks.map((link, index) => (
              <RouterLink 
                key={index} 
                to={link.path} 
                className="group no-underline block"
              >
                <div className="w-full h-auto flex flex-col items-center justify-center py-4 gap-2 border rounded-md transition-all duration-200 hover:border-glee-spelman/20 hover:bg-glee-spelman/5 hover:shadow-md">
                  <div className={`${link.color} text-white p-2 rounded-full group-hover:scale-110 transition-transform duration-200`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-center group-hover:text-glee-spelman transition-colors duration-200">
                    {link.title}
                  </span>
                </div>
              </RouterLink>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional member-specific content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingEventsList limit={3} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-md">
                <h4 className="font-medium text-sm">Spring Concert Rehearsal</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Don't forget to bring your sheet music for tomorrow's rehearsal.
                </p>
                <p className="text-xs mt-2">May 20, 2025</p>
              </div>
              <div className="p-3 border rounded-md">
                <h4 className="font-medium text-sm">New Practice Tracks Available</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Practice tracks for "Ave Maria" have been uploaded to the recordings section.
                </p>
                <p className="text-xs mt-2">May 18, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="mr-2 h-5 w-5" />
            Recently Added Music
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <h4 className="font-medium text-sm">Ave Maria</h4>
              <p className="text-xs text-muted-foreground">Soprano 1 & 2</p>
            </div>
            <div className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <h4 className="font-medium text-sm">Amazing Grace</h4>
              <p className="text-xs text-muted-foreground">All Parts</p>
            </div>
            <div className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
              <h4 className="font-medium text-sm">Swing Low</h4>
              <p className="text-xs text-muted-foreground">Alto 1 & 2</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

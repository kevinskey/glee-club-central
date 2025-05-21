import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Calendar, Music, Bell, Headphones, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAccessItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const quickAccessItems: QuickAccessItem[] = [
  {
    title: "Dashboard",
    description: "Return to the main dashboard",
    icon: <Home className="h-4 w-4 mr-2 text-muted-foreground" />,
    link: "/dashboard",
  },
  {
    title: "Calendar",
    description: "View upcoming events and rehearsals",
    icon: <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />,
    link: "/dashboard/calendar",
  },
  {
    title: "Sheet Music",
    description: "Access and download sheet music",
    icon: <Music className="h-4 w-4 mr-2 text-muted-foreground" />,
    link: "/dashboard/sheet-music",
  },
  {
    title: "Recordings",
    description: "Listen to recordings and practice tracks",
    icon: <Headphones className="h-4 w-4 mr-2 text-muted-foreground" />,
    link: "/dashboard/recordings",
  },
  {
    title: "Announcements",
    description: "Read the latest announcements",
    icon: <Bell className="h-4 w-4 mr-2 text-muted-foreground" />,
    link: "/dashboard/announcements",
  },
  {
    title: "Profile",
    description: "Manage your profile and settings",
    icon: <User className="h-4 w-4 mr-2 text-muted-foreground" />,
    link: "/dashboard/profile",
  },
];

// Memoize the component to prevent unnecessary re-renders
export const QuickAccess = memo(function QuickAccess() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {quickAccessItems.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="flex items-center space-x-3 bg-muted/50 hover:bg-muted rounded-md p-3 transition-colors"
          >
            {item.icon}
            <div>
              <p className="text-sm font-medium leading-none">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
});

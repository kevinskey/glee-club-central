
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckSquare,
  Bell,
  Book,
  User,
  FileText
} from "lucide-react";

export function QuickAccess() {
  const links = [
    {
      icon: <User className="h-4 w-4" />,
      label: "Profile",
      href: "/dashboard/profile"
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Sheet Music",
      href: "/dashboard/sheet-music"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Calendar",
      href: "/dashboard/calendar"
    },
    {
      icon: <CheckSquare className="h-4 w-4" />,
      label: "Attendance",
      href: "/dashboard/attendance"
    },
    {
      icon: <Bell className="h-4 w-4" />,
      label: "Announcements",
      href: "/dashboard/announcements"
    },
    {
      icon: <Book className="h-4 w-4" />,
      label: "Practice",
      href: "/dashboard/practice"
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Resources",
      href: "/dashboard/resources"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {links.map((link, index) => (
            <Link 
              key={index} 
              to={link.href}
              className="no-underline"
            >
              <Button 
                variant="outline" 
                className="w-full justify-start flex gap-2 hover:bg-muted"
              >
                {link.icon}
                <span>{link.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

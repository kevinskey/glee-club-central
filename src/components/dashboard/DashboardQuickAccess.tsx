
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Music,
  Calendar,
  CheckSquare,
  Bell,
  MessageSquare,
  Users,
  Upload,
  BarChart,
  Settings
} from "lucide-react";

export function DashboardQuickAccess() {
  const { isAdmin } = useAuth();
  
  // Quick access links for users
  const quickAccessLinks = [
    { icon: <User className="h-5 w-5" />, title: "My Profile", path: "/dashboard/profile", color: "bg-blue-500" },
    { icon: <Music className="h-5 w-5" />, title: "Sheet Music", path: "/dashboard/sheet-music", color: "bg-purple-500" },
    { icon: <Calendar className="h-5 w-5" />, title: "Calendar", path: "/dashboard/calendar", color: "bg-green-500" },
    { icon: <CheckSquare className="h-5 w-5" />, title: "Attendance", path: "/dashboard/attendance", color: "bg-orange-500" },
    { icon: <Bell className="h-5 w-5" />, title: "Announcements", path: "/dashboard/announcements", color: "bg-red-500" },
    { icon: <MessageSquare className="h-5 w-5" />, title: "Contact Admin", path: "/dashboard/contact", color: "bg-indigo-500" },
  ];
  
  // Admin quick links
  const adminQuickLinks = [
    { icon: <Users className="h-5 w-5" />, title: "User Management", path: "/dashboard/admin/users", color: "bg-slate-500" },
    { icon: <Upload className="h-5 w-5" />, title: "Media Manager", path: "/dashboard/admin/media", color: "bg-emerald-500" },
    { icon: <Calendar className="h-5 w-5" />, title: "Event Manager", path: "/dashboard/admin/events", color: "bg-yellow-500" },
    { icon: <BarChart className="h-5 w-5" />, title: "Analytics", path: "/dashboard/admin/analytics", color: "bg-violet-500" },
    { icon: <Settings className="h-5 w-5" />, title: "Site Settings", path: "/dashboard/admin/settings", color: "bg-rose-500" },
  ];
  
  const currentLinks = isAdmin() ? adminQuickLinks : quickAccessLinks;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>
              {isAdmin() ? "Administrative Tools" : "Frequently used resources"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {currentLinks.map((link, index) => (
            <Link key={index} to={link.path} className="no-underline">
              <Button 
                variant="outline" 
                className="w-full h-auto flex-col py-4 gap-2 hover:border-primary"
              >
                <div className={`${link.color} text-white p-2 rounded-full`}>
                  {link.icon}
                </div>
                <span className="text-xs font-medium">{link.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

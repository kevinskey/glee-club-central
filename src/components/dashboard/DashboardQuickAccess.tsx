
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
  Settings,
  FileText,
  Headphones,
  Shirt,
  DollarSign
} from "lucide-react";

export function DashboardQuickAccess() {
  const { isAdmin } = useAuth();
  
  // Quick access links for users
  const quickAccessLinks = [
    { icon: <User className="h-5 w-5" />, title: "My Profile", path: "/dashboard/profile", color: "bg-orange-500" },
    { icon: <Music className="h-5 w-5" />, title: "Sheet Music", path: "/dashboard/sheet-music", color: "bg-purple-500" },
    { icon: <Headphones className="h-5 w-5" />, title: "Practice Tracks", path: "/dashboard/recordings", color: "bg-blue-500" },
    { icon: <Calendar className="h-5 w-5" />, title: "Calendar", path: "/dashboard/calendar", color: "bg-green-500" },
    { icon: <CheckSquare className="h-5 w-5" />, title: "Attendance", path: "/dashboard/attendance", color: "bg-amber-500" },
    { icon: <Shirt className="h-5 w-5" />, title: "Wardrobe", path: "/dashboard/wardrobe", color: "bg-pink-500" },
    { icon: <DollarSign className="h-5 w-5" />, title: "Dues", path: "/dashboard/dues", color: "bg-emerald-500" },
    { icon: <Bell className="h-5 w-5" />, title: "Announcements", path: "/dashboard/announcements", color: "bg-red-500" },
  ];
  
  // Admin quick links
  const adminQuickLinks = [
    { icon: <Users className="h-5 w-5" />, title: "Member Management", path: "/dashboard/admin/members", color: "bg-slate-500" },
    { icon: <Music className="h-5 w-5" />, title: "Sheet Music", path: "/dashboard/sheet-music", color: "bg-purple-500" },
    { icon: <Calendar className="h-5 w-5" />, title: "Event Manager", path: "/dashboard/admin/events", color: "bg-yellow-500" },
    { icon: <MessageSquare className="h-5 w-5" />, title: "Messaging", path: "/dashboard/messaging", color: "bg-blue-500" },
    { icon: <DollarSign className="h-5 w-5" />, title: "Finance", path: "/dashboard/admin/finances", color: "bg-emerald-500" },
    { icon: <Bell className="h-5 w-5" />, title: "Announcements", path: "/dashboard/announcements/new", color: "bg-red-500" },
    { icon: <Upload className="h-5 w-5" />, title: "Media Manager", path: "/dashboard/media-library", color: "bg-pink-500" },
    { icon: <Settings className="h-5 w-5" />, title: "Settings", path: "/dashboard/admin/settings", color: "bg-gray-500" },
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentLinks.map((link, index) => (
            <Link key={index} to={link.path} className="no-underline">
              <Button 
                variant="outline" 
                className="w-full h-auto flex-col py-4 gap-2 hover:border-orange-300 hover:bg-orange-50"
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

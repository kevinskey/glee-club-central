
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  User,
  Music,
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
  DollarSign,
  LayoutDashboard
} from "lucide-react";

export function DashboardQuickAccess() {
  const { user } = useAuth();
  const { profile, isAdmin } = useProfile();
  const isAdminUser = isAdmin();
  
  // Debug logging for admin detection
  console.log('DashboardQuickAccess admin check:', {
    hasProfile: !!profile,
    profileRole: profile?.role,
    profileIsSuperAdmin: profile?.is_super_admin,
    isAdminFunction: isAdminUser,
    finalDecision: isAdminUser
  });
  
  // Quick access links for regular users
  const memberQuickAccessLinks = [
    { icon: <User className="h-5 w-5" />, title: "My Profile", path: "/profile", color: "bg-glee-spelman" },
    { icon: <Music className="h-5 w-5" />, title: "Sheet Music", path: "/calendar", color: "bg-purple-500" },
    { icon: <Headphones className="h-5 w-5" />, title: "Practice Tracks", path: "/calendar", color: "bg-blue-500" },
    { icon: <CheckSquare className="h-5 w-5" />, title: "Attendance", path: "/calendar", color: "bg-amber-500" },
    { icon: <Shirt className="h-5 w-5" />, title: "Wardrobe", path: "/calendar", color: "bg-pink-500" },
    { icon: <DollarSign className="h-5 w-5" />, title: "Dues", path: "/calendar", color: "bg-emerald-500" },
    { icon: <Bell className="h-5 w-5" />, title: "Announcements", path: "/calendar", color: "bg-red-500" },
  ];
  
  // Enhanced quick access links for admin users
  const adminQuickAccessLinks = [
    { icon: <LayoutDashboard className="h-5 w-5" />, title: "Admin Dashboard", path: "/admin", color: "bg-glee-spelman" },
    { icon: <Users className="h-5 w-5" />, title: "Member Management", path: "/admin/members", color: "bg-slate-500" },
    { icon: <Music className="h-5 w-5" />, title: "Sheet Music", path: "/admin/media-uploader", color: "bg-purple-500" },
    { icon: <Upload className="h-5 w-5" />, title: "Media Manager", path: "/admin/hero-manager", color: "bg-pink-500" },
    { icon: <BarChart className="h-5 w-5" />, title: "Analytics", path: "/admin/analytics", color: "bg-blue-500" },
    { icon: <Bell className="h-5 w-5" />, title: "Announcements", path: "/admin/announcements", color: "bg-red-500" },
    { icon: <Settings className="h-5 w-5" />, title: "Settings", path: "/admin/settings", color: "bg-gray-500" },
  ];
  
  const currentLinks = isAdminUser ? adminQuickAccessLinks : memberQuickAccessLinks;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>
              {isAdminUser ? "Administrative Tools & Resources" : "Frequently used resources"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {currentLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path} 
              className="group no-underline block"
            >
              <div className="w-full h-auto flex flex-col items-center justify-center py-6 px-3 gap-3 border rounded-lg transition-all duration-200 hover:border-glee-spelman/30 hover:bg-glee-spelman/5 hover:shadow-lg hover:scale-105">
                <div className={`${link.color} text-white p-3 rounded-full group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                  {link.icon}
                </div>
                <span className="text-sm font-medium text-center group-hover:text-glee-spelman transition-colors duration-200 leading-tight">
                  {link.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

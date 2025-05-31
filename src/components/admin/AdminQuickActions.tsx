
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Upload, 
  Users, 
  Plus,
  ArrowRight,
  Settings,
  BarChart3,
  Bell
} from "lucide-react";

interface AdminQuickActionsProps {
  isMobile?: boolean;
}

export function AdminQuickActions({ isMobile = false }: AdminQuickActionsProps) {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };
  
  const actions = [
    {
      title: "Site Settings",
      description: "Configure system settings",
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => handleNavigation("/admin/settings"),
    },
    {
      title: "User Management", 
      description: "Manage users and permissions",
      icon: Users,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => handleNavigation("/admin/members"),
    },
    {
      title: "Media Uploader",
      description: "Upload and manage media files",
      icon: Upload,
      color: "bg-green-500 hover:bg-green-600",
      action: () => handleNavigation("/admin/media-uploader"),
    },
    {
      title: "Analytics",
      description: "View site usage and statistics",
      icon: BarChart3,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => handleNavigation("/admin/analytics"),
    },
    {
      title: "Calendar Events",
      description: "Manage events and schedule",
      icon: Calendar,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => handleNavigation("/admin/calendar"),
    },
    {
      title: "Announcements",
      description: "Send club announcements",
      icon: Bell,
      color: "bg-red-500 hover:bg-red-600",
      action: () => handleNavigation("/admin/announcements"),
    },
  ];
  
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Plus className="h-5 w-5 text-orange-500" />
          Quick Actions
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Common administrative tasks
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="w-full h-auto p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 group transition-all duration-200"
              onClick={action.action}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${action.color} text-white transition-colors duration-200`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {action.description}
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200" />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

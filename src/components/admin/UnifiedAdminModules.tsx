
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/utils/permissionChecker";
import { 
  ShoppingBag, Plus, Upload,
  Music, BarChart, Settings, Layout, Presentation, FileText,
  Users, Calendar, Sliders, Bell, FileMusic
} from "lucide-react";

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  adminOnly: boolean;
  permission?: string;
  isPriority?: boolean;
}

export function UnifiedAdminModules() {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();
  
  const currentUser = {
    ...user,
    role_tags: profile?.role_tags || []
  };

  const moduleItems: ModuleItem[] = [
    {
      id: "analytics",
      title: "Analytics",
      description: "View insights and reports",
      icon: <BarChart className="h-5 w-5" />,
      color: "bg-cyan-500",
      path: "/admin/analytics",
      adminOnly: true,
      permission: "view_budget"
    },
    {
      id: "communications",
      title: "Communications",
      description: "Send announcements and news",
      icon: <Bell className="h-5 w-5" />,
      color: "bg-red-500",
      path: "/admin/news-items",
      adminOnly: true
    },
    {
      id: "calendar",
      title: "Events & Calendar",
      description: "Schedule and manage events",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-green-500",
      path: "/admin/calendar",
      adminOnly: true
    },
    {
      id: "media",
      title: "Media Library",
      description: "Upload and organize files",
      icon: <Upload className="h-5 w-5" />,
      color: "bg-orange-500",
      path: "/admin/media-library",
      adminOnly: true,
      permission: "upload_media"
    },
    {
      id: "users",
      title: "Members",
      description: "Manage choir members and users",
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
      path: "/admin/users",
      adminOnly: true
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure system settings",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-gray-500",
      path: "/admin/settings",
      adminOnly: true
    },
    {
      id: "sheet-music",
      title: "Sheet Music",
      description: "PDF viewer and music management",
      icon: <FileMusic className="h-5 w-5" />,
      color: "bg-violet-500",
      path: "/sheet-music",
      adminOnly: true
    },
    {
      id: "slider",
      title: "Slide Designer",
      description: "Create and manage slides",
      icon: <Sliders className="h-5 w-5" />,
      color: "bg-purple-500",
      path: "/admin/unified-slide-management",
      adminOnly: true
    },
    {
      id: "store",
      title: "Store",
      description: "Manage products and orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-emerald-500",
      path: "/admin/store",
      adminOnly: true
    }
  ];

  // Filter modules based on admin status and permissions
  const availableModules = moduleItems.filter(module => {
    if (module.adminOnly && !isAdmin()) {
      return false;
    }
    
    if (module.permission) {
      return hasPermission(currentUser, module.permission);
    }
    
    return true;
  });

  const sortedModules = [...availableModules].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Admin Modules
          <Badge variant="secondary">{sortedModules.length} available</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedModules.map((module) => (
            <div
              key={module.id}
              className="group cursor-pointer flex flex-col items-center justify-center p-6 border rounded-lg transition-all duration-200 hover:border-glee-spelman/30 hover:bg-glee-spelman/5 hover:shadow-lg hover:scale-105"
              onClick={() => navigate(module.path)}
            >
              <div className={`${module.color} text-white rounded-lg p-3 group-hover:scale-110 transition-transform duration-200 mb-3`}>
                {module.icon}
              </div>
              <span className="text-sm font-medium text-center group-hover:text-glee-spelman transition-colors duration-200 leading-tight mb-2">
                {module.title}
              </span>
              <span className="text-xs text-muted-foreground text-center leading-tight">
                {module.description}
              </span>
            </div>
          ))}
        </div>
        
        {sortedModules.length === 0 && (
          <div className="p-8 text-center border rounded-lg">
            <div className="text-muted-foreground mb-2">
              No modules available for your role
            </div>
            <p className="text-sm">
              Contact an administrator if you need access to specific features
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

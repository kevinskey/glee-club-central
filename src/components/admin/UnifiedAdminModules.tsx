
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/utils/permissionChecker";
import { 
  ShoppingBag, Plus, Upload,
  Music, BarChart, Settings, Layout, Presentation, FileText,
  Users, Calendar, Sliders, Bell, FileMusic, UserCog, DollarSign
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
      id: "financial",
      title: "Financial Management",
      description: "Track income, expenses, and budgets",
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-emerald-600",
      path: "/admin/financial",
      adminOnly: true,
      isPriority: true
    },
    {
      id: "hero-slides",
      title: "Hero Slides",
      description: "Manage homepage hero slides",
      icon: <Presentation className="h-5 w-5" />,
      color: "bg-blue-500",
      path: "/admin/hero-slides",
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
      id: "music-player",
      title: "Music Player",
      description: "Manage playlists and player settings",
      icon: <Music className="h-5 w-5" />,
      color: "bg-orange-500",
      path: "/admin/music",
      adminOnly: true
    },
    {
      id: "settings",
      title: "Site Settings",
      description: "Configure system settings and preferences",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-gray-500",
      path: "/admin/settings",
      adminOnly: true,
      isPriority: true
    },
    {
      id: "store",
      title: "Store Management",
      description: "Manage products and orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-emerald-500",
      path: "/admin/store",
      adminOnly: true
    },
    {
      id: "user-roles",
      title: "User Roles",
      description: "Manage user permissions and roles",
      icon: <UserCog className="h-5 w-5" />,
      color: "bg-purple-500",
      path: "/admin/user-roles",
      adminOnly: true,
      isPriority: true
    }
  ];

  const filteredModules = moduleItems.filter(module => {
    if (module.adminOnly && !isAdmin()) {
      return false;
    }
    
    if (module.permission) {
      return hasPermission(currentUser, module.permission);
    }
    
    return true;
  });
  
  const sortedModules = [...filteredModules].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-xl font-bold">
            Admin Modules
            <Badge variant="secondary" className="text-sm font-medium">{sortedModules.length} available</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {sortedModules.map((module) => (
              <div
                key={module.id}
                className="group cursor-pointer flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 hover:border-glee-spelman/40 hover:bg-glee-spelman/5 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] min-h-[120px] aspect-square"
                onClick={() => navigate(module.path)}
              >
                <div className={`${module.color} text-white rounded-xl p-3 group-hover:scale-110 transition-transform duration-200 mb-3 shadow-sm`}>
                  {module.icon}
                </div>
                <span className="text-xs font-semibold text-center group-hover:text-glee-spelman transition-colors duration-200 leading-tight mb-1">
                  {module.title}
                </span>
                <span className="text-xs text-muted-foreground text-center leading-tight opacity-80">
                  {module.description}
                </span>
              </div>
            ))}
          </div>
          
          {sortedModules.length === 0 && (
            <div className="p-12 text-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-muted-foreground mb-3 text-base font-medium">
                No modules available for your role
              </div>
              <p className="text-sm text-muted-foreground">
                Contact an administrator if you need access to specific features
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

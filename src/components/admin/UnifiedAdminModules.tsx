
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/utils/permissionChecker";
import { 
  LayoutDashboard, ShoppingBag, Plus, Upload,
  Music, BarChart, Settings, Layout, Presentation, FileText,
  Users, Calendar, Sliders, Bell
} from "lucide-react";

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  adminOnly: boolean;
  category: string;
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
    // Priority Actions (smaller size)
    {
      id: "users",
      title: "Users/Members",
      description: "Manage choir members",
      icon: <Users className="h-4 w-4" />,
      color: "bg-blue-500",
      path: "/admin/users",
      adminOnly: true,
      category: "Priority Actions",
      isPriority: true
    },
    {
      id: "calendar",
      title: "Calendar",
      description: "Manage events",
      icon: <Calendar className="h-4 w-4" />,
      color: "bg-green-500",
      path: "/admin/calendar",
      adminOnly: true,
      category: "Priority Actions",
      isPriority: true
    },
    {
      id: "slider",
      title: "Slider Management",
      description: "Design slides",
      icon: <Sliders className="h-4 w-4" />,
      color: "bg-purple-500",
      path: "/admin/unified-slide-management",
      adminOnly: true,
      category: "Priority Actions",
      isPriority: true
    },
    {
      id: "communications",
      title: "Communications",
      description: "Send announcements",
      icon: <Bell className="h-4 w-4" />,
      color: "bg-red-500",
      path: "/admin/news-items",
      adminOnly: true,
      category: "Priority Actions",
      isPriority: true
    },
    
    // Quick Actions
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Admin dashboard overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      color: "bg-glee-spelman",
      path: "/admin",
      adminOnly: true,
      category: "Quick Actions"
    },
    
    // Administration
    {
      id: "settings",
      title: "Settings",
      description: "Configure system settings",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-gray-500",
      path: "/admin/settings",
      adminOnly: true,
      category: "Administration"
    },
    
    // Content Management
    {
      id: "media",
      title: "Media Library",
      description: "Upload and organize media files",
      icon: <Upload className="h-5 w-5" />,
      color: "bg-orange-500",
      path: "/admin/media-library",
      adminOnly: true,
      category: "Content Management",
      permission: "upload_media"
    },
    {
      id: "music",
      title: "Music Library",
      description: "Manage sheet music and audio",
      icon: <Music className="h-5 w-5" />,
      color: "bg-indigo-500",
      path: "/admin/media-library",
      adminOnly: true,
      category: "Content Management"
    },
    
    // Store & Analytics
    {
      id: "store",
      title: "Store Management",
      description: "Manage store products and orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-emerald-500",
      path: "/admin/store",
      adminOnly: true,
      category: "Store & Analytics"
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View site usage and analytics",
      icon: <BarChart className="h-5 w-5" />,
      color: "bg-cyan-500",
      path: "/admin/analytics",
      adminOnly: true,
      category: "Store & Analytics",
      permission: "view_budget"
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

  // Group modules by category
  const groupedModules = availableModules.reduce((acc, module) => {
    const category = module.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, ModuleItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Admin Modules
          <Badge variant="secondary">{availableModules.length} available</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedModules).map(([category, modules]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium">{category}</h3>
              <Badge variant="outline" className="text-xs">
                {modules.length}
              </Badge>
            </div>
            
            <div className={`grid gap-3 ${
              category === "Priority Actions" 
                ? "grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4" 
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            }`}>
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`group cursor-pointer h-auto flex flex-col items-center justify-center border rounded-lg transition-all duration-200 hover:border-glee-spelman/20 hover:bg-glee-spelman/5 hover:shadow-md hover:scale-105 ${
                    module.isPriority ? "py-3 px-2" : "py-4 px-3"
                  }`}
                  onClick={() => navigate(module.path)}
                >
                  <div className={`${module.color} text-white rounded-lg group-hover:scale-110 transition-transform duration-200 mb-2 ${
                    module.isPriority ? "p-2" : "p-3"
                  }`}>
                    {module.icon}
                  </div>
                  <span className={`font-medium text-center group-hover:text-glee-spelman transition-colors duration-200 leading-tight mb-1 ${
                    module.isPriority ? "text-xs" : "text-sm"
                  }`}>
                    {module.title}
                  </span>
                  <span className={`text-muted-foreground text-center leading-tight ${
                    module.isPriority ? "text-xs" : "text-xs"
                  }`}>
                    {module.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {availableModules.length === 0 && (
          <div className="col-span-full p-6 text-center border rounded-lg">
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


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
    // Core Management
    {
      id: "users",
      title: "Members",
      description: "Manage choir members and users",
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
      path: "/admin/users",
      adminOnly: true,
      category: "Core Management"
    },
    {
      id: "calendar",
      title: "Events & Calendar",
      description: "Schedule and manage events",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-green-500",
      path: "/admin/calendar",
      adminOnly: true,
      category: "Core Management"
    },
    {
      id: "communications",
      title: "Communications",
      description: "Send announcements and news",
      icon: <Bell className="h-5 w-5" />,
      color: "bg-red-500",
      path: "/admin/news-items",
      adminOnly: true,
      category: "Core Management"
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure system settings",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-gray-500",
      path: "/admin/settings",
      adminOnly: true,
      category: "Core Management"
    },
    
    // Content & Media
    {
      id: "slider",
      title: "Slide Designer",
      description: "Create and manage slides",
      icon: <Sliders className="h-5 w-5" />,
      color: "bg-purple-500",
      path: "/admin/unified-slide-management",
      adminOnly: true,
      category: "Content & Media"
    },
    {
      id: "media",
      title: "Media Library",
      description: "Upload and organize files",
      icon: <Upload className="h-5 w-5" />,
      color: "bg-orange-500",
      path: "/admin/media-library",
      adminOnly: true,
      category: "Content & Media",
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
      category: "Content & Media"
    },
    
    // Business Operations
    {
      id: "store",
      title: "Store",
      description: "Manage products and orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-emerald-500",
      path: "/admin/store",
      adminOnly: true,
      category: "Business Operations"
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View insights and reports",
      icon: <BarChart className="h-5 w-5" />,
      color: "bg-cyan-500",
      path: "/admin/analytics",
      adminOnly: true,
      category: "Business Operations",
      permission: "view_budget"
    },
    
    // Quick Access
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Admin overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      color: "bg-glee-spelman",
      path: "/admin",
      adminOnly: true,
      category: "Quick Access"
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

  // Define category order
  const categoryOrder = ["Core Management", "Content & Media", "Business Operations", "Quick Access"];
  const orderedCategories = categoryOrder.filter(category => groupedModules[category]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Admin Modules
          <Badge variant="secondary">{availableModules.length} available</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {orderedCategories.map((category) => {
          const modules = groupedModules[category];
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{category}</h3>
                <Badge variant="outline" className="text-xs">
                  {modules.length} {modules.length === 1 ? 'module' : 'modules'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {modules.map((module) => (
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
            </div>
          );
        })}
        
        {availableModules.length === 0 && (
          <div className="col-span-full p-8 text-center border rounded-lg">
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

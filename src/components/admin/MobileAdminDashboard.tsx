import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import {
  Users,
  Calendar,
  Upload,
  Music,
  Bell,
  BarChart3,
  FileImage,
  Settings,
  ShoppingBag,
  ImageIcon,
} from "lucide-react";

export function MobileAdminDashboard() {
  const navigate = useNavigate();
  const { mediaStats, isLoading } = useMediaLibrary();

  const quickActions = [
    {
      title: "Users",
      description: "Manage members",
      icon: Users,
      path: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "Calendar",
      description: "Events & rehearsals",
      icon: Calendar,
      path: "/admin/calendar",
      color: "bg-green-500",
    },
    {
      title: "Store",
      description: "Manage products",
      icon: ShoppingBag,
      path: "/admin/store",
      color: "bg-emerald-500",
    },
    {
      title: "Hero",
      description: "Edit homepage",
      icon: ImageIcon,
      path: "/admin/hero-manager",
      color: "bg-purple-500",
    },
    {
      title: "Media",
      description: "Upload files",
      icon: Upload,
      path: "/admin/media-library",
      color: "bg-orange-500",
    },
    {
      title: "Analytics",
      description: "View reports",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "bg-cyan-500",
    },
    {
      title: "Settings",
      description: "System config",
      icon: Settings,
      path: "/admin/settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="w-full max-w-full p-2 space-y-3 overflow-x-hidden">
      {/* Header */}
      <div className="w-full">
        <h1 className="text-xl font-bold text-navy-900 mb-1">
          Admin Dashboard
        </h1>
        <p className="text-xs text-muted-foreground">Manage your Glee Club</p>
      </div>

      {/* Combined Stats Card */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-3 w-3 text-blue-500 mr-1" />
                <span className="text-xs text-muted-foreground">Members</span>
              </div>
              <div className="text-lg font-bold text-blue-500">42</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-muted-foreground">Events</span>
              </div>
              <div className="text-lg font-bold text-green-500">8</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FileImage className="h-3 w-3 text-orange-500 mr-1" />
                <span className="text-xs text-muted-foreground">Media</span>
              </div>
              <div className="text-lg font-bold text-orange-500">
                {isLoading ? "..." : mediaStats?.totalFiles?.toString() || "0"}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <ShoppingBag className="h-3 w-3 text-purple-500 mr-1" />
                <span className="text-xs text-muted-foreground">Orders</span>
              </div>
              <div className="text-lg font-bold text-purple-500">3</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="w-full">
        <h2 className="text-sm font-semibold text-navy-900 mb-2">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2 w-full">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="w-full cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-2 text-center">
                <div
                  className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white mx-auto mb-1`}
                >
                  <action.icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-navy-900 mb-0.5">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

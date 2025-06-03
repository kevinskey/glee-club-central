
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  Calendar,
  Upload,
  Settings,
  Music,
  Bell,
  BarChart,
  LayoutDashboard,
  ImageIcon,
  ShoppingBag,
  Layout
} from "lucide-react";

interface AdminQuickActionsProps {
  isMobile?: boolean;
}

export function AdminQuickActions({ isMobile = false }: AdminQuickActionsProps) {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      action: () => navigate("/admin"),
      color: "bg-glee-spelman"
    },
    {
      title: "Slide Designer",
      icon: <Layout className="h-4 w-4" />,
      action: () => navigate("/admin/slide-design"),
      color: "bg-purple-500"
    },
    {
      title: "Edit Hero",
      icon: <ImageIcon className="h-4 w-4" />,
      action: () => navigate("/admin/hero-manager"),
      color: "bg-purple-500"
    },
    {
      title: "Store",
      icon: <ShoppingBag className="h-4 w-4" />,
      action: () => navigate("/admin/store"),
      color: "bg-emerald-500"
    },
    {
      title: "Add Member",
      icon: <Plus className="h-4 w-4" />,
      action: () => navigate("/admin/users"),
      color: "bg-blue-500"
    },
    {
      title: "Users",
      icon: <Users className="h-4 w-4" />,
      action: () => navigate("/admin/users"),
      color: "bg-green-500"
    },
    {
      title: "Calendar",
      icon: <Calendar className="h-4 w-4" />,
      action: () => navigate("/admin/calendar"),
      color: "bg-purple-500"
    },
    {
      title: "Media",
      icon: <Upload className="h-4 w-4" />,
      action: () => navigate("/admin/media-library"),
      color: "bg-orange-500"
    },
    {
      title: "Music",
      icon: <Music className="h-4 w-4" />,
      action: () => navigate("/admin/media-library"),
      color: "bg-indigo-500"
    },
    {
      title: "News",
      icon: <Bell className="h-4 w-4" />,
      action: () => navigate("/admin/news-items"),
      color: "bg-red-500"
    },
    {
      title: "Analytics",
      icon: <BarChart className="h-4 w-4" />,
      action: () => navigate("/admin/analytics"),
      color: "bg-cyan-500"
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      action: () => navigate("/admin/settings"),
      color: "bg-gray-500"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={action.action}
            >
              <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                {action.icon}
              </div>
              <span className="text-xs font-medium text-center leading-tight">
                {action.title}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardTester } from "@/components/dashboard/DashboardTester";
import {
  Plus,
  Users,
  Calendar,
  Upload,
  Settings,
  TestTube,
  Music,
  Bell,
  BarChart,
  FileText
} from "lucide-react";

interface AdminQuickActionsProps {
  isMobile?: boolean;
}

export function AdminQuickActions({ isMobile = false }: AdminQuickActionsProps) {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Add Member",
      description: "Create new member account",
      icon: <Plus className="h-5 w-5" />,
      action: () => navigate("/admin/members"),
      color: "bg-blue-500",
      category: "User Management"
    },
    {
      title: "Manage Users",
      description: "View and edit accounts",
      icon: <Users className="h-5 w-5" />,
      action: () => navigate("/admin/members"),
      color: "bg-green-500",
      category: "User Management"
    },
    {
      title: "Add Event",
      description: "Create calendar event",
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate("/admin/calendar"),
      color: "bg-purple-500",
      category: "Content Management"
    },
    {
      title: "Upload Media",
      description: "Add media files",
      icon: <Upload className="h-5 w-5" />,
      action: () => navigate("/admin/hero-manager"),
      color: "bg-orange-500",
      category: "Content Management"
    },
    {
      title: "Sheet Music",
      description: "Manage music library",
      icon: <Music className="h-5 w-5" />,
      action: () => navigate("/admin"),
      color: "bg-indigo-500",
      category: "Content Management"
    },
    {
      title: "Announcements",
      description: "Send notifications",
      icon: <Bell className="h-5 w-5" />,
      action: () => navigate("/admin"),
      color: "bg-red-500",
      category: "Communication"
    },
    {
      title: "Analytics",
      description: "View reports",
      icon: <BarChart className="h-5 w-5" />,
      action: () => navigate("/admin"),
      color: "bg-cyan-500",
      category: "Analytics"
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate("/admin"),
      color: "bg-gray-500",
      category: "System"
    }
  ];

  // Group actions by category
  const groupedActions = quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, typeof quickActions>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // Mobile: Single column with categories
            <div className="space-y-6">
              {Object.entries(groupedActions).map(([category, actions]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="grid gap-2">
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={action.action}
                      >
                        <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white mr-3 flex-shrink-0`}>
                          {action.icon}
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{action.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop: Multi-column layout
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(groupedActions).map(([category, actions]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide border-b pb-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto p-3 w-full"
                        onClick={action.action}
                      >
                        <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                          {action.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dashboard Tester - Only show in development or for admin testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Dashboard Assignment Tester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardTester />
        </CardContent>
      </Card>
    </div>
  );
}

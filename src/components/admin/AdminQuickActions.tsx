
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
  TestTube
} from "lucide-react";

interface AdminQuickActionsProps {
  isMobile?: boolean;
}

export function AdminQuickActions({ isMobile = false }: AdminQuickActionsProps) {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Add Member",
      description: "Create a new member account",
      icon: <Plus className="h-5 w-5" />,
      action: () => navigate("/admin/members"),
      color: "bg-blue-500"
    },
    {
      title: "Manage Users",
      description: "View and edit user accounts",
      icon: <Users className="h-5 w-5" />,
      action: () => navigate("/admin/members"),
      color: "bg-green-500"
    },
    {
      title: "Add Event",
      description: "Create a new calendar event",
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate("/admin/calendar"),
      color: "bg-purple-500"
    },
    {
      title: "Upload Media",
      description: "Add new media files",
      icon: <Upload className="h-5 w-5" />,
      action: () => navigate("/admin/media-uploader"),
      color: "bg-orange-500"
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate("/admin/settings"),
      color: "bg-gray-500"
    }
  ];

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
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1'}`}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={action.action}
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                  {action.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
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

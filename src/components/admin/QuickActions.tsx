
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Calendar, 
  FileText, 
  Music, 
  Upload,
  Users 
} from "lucide-react";

export function QuickActions() {
  const navigate = useNavigate();
  
  const actions = [
    {
      title: "Add Member",
      icon: Users,
      action: () => navigate("/dashboard/admin/members/add"),
      variant: "outline" as const
    },
    {
      title: "Schedule Event",
      icon: Calendar,
      action: () => navigate("/dashboard/calendar"),
      variant: "outline" as const
    },
    {
      title: "Send Announcement",
      icon: Bell,
      action: () => navigate("/dashboard/announcements/new"),
      variant: "outline" as const
    },
    {
      title: "Upload Music",
      icon: Music,
      action: () => navigate("/dashboard/sheet-music"),
      variant: "outline" as const
    },
    {
      title: "Upload Media",
      icon: Upload,
      action: () => navigate("/dashboard/media-library"),
      variant: "outline" as const
    },
    {
      title: "Update Handbook",
      icon: FileText,
      action: () => navigate("/dashboard/handbook"),
      variant: "outline" as const
    },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((action) => (
            <Button 
              key={action.title}
              variant={action.variant}
              className="h-auto flex-col py-4 px-2"
              onClick={action.action}
            >
              <action.icon className="h-5 w-5 mb-2" />
              <span className="text-xs">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

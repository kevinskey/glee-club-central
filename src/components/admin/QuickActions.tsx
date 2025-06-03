
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Calendar, 
  FileText, 
  Music, 
  Upload,
  Users,
  Presentation
} from "lucide-react";

export function QuickActions() {
  const navigate = useNavigate();
  
  const actions = [
    {
      title: "Add Member",
      icon: Users,
      action: () => navigate("/admin/members"),
      color: "bg-blue-500"
    },
    {
      title: "Schedule Event",
      icon: Calendar,
      action: () => navigate("/admin/calendar"),
      color: "bg-green-500"
    },
    {
      title: "Design Slides",
      icon: Presentation,
      action: () => navigate("/admin/slide-design"),
      color: "bg-orange-500"
    },
    {
      title: "Send Announcement",
      icon: Bell,
      action: () => navigate("/admin"),
      color: "bg-red-500"
    },
    {
      title: "Upload Music",
      icon: Music,
      action: () => navigate("/admin"),
      color: "bg-purple-500"
    },
    {
      title: "Upload Media",
      icon: Upload,
      action: () => navigate("/admin/hero-manager"),
      color: "bg-pink-500"
    },
    {
      title: "Update Handbook",
      icon: FileText,
      action: () => navigate("/admin"),
      color: "bg-amber-500"
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
            <div 
              key={action.title}
              className="group cursor-pointer h-auto flex flex-col items-center justify-center py-4 px-2 border rounded-md transition-all duration-200 hover:border-glee-spelman/20 hover:bg-glee-spelman/5 hover:shadow-md"
              onClick={action.action}
            >
              <div className={`${action.color} text-white p-2 rounded-full group-hover:scale-110 transition-transform duration-200 mb-2`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-center group-hover:text-glee-spelman transition-colors duration-200">
                {action.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

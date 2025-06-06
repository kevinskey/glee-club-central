
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  Sliders, 
  Bell
} from "lucide-react";

export function AdminPriorityActions() {
  const navigate = useNavigate();

  const priorityActions = [
    {
      id: "users",
      title: "Users/Members",
      description: "Manage choir members and users",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      path: "/admin/users"
    },
    {
      id: "calendar",
      title: "Calendar",
      description: "Manage events and rehearsals",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-green-500",
      path: "/admin/calendar"
    },
    {
      id: "slider",
      title: "Slider Management",
      description: "Design slides & manage sliders",
      icon: <Sliders className="h-6 w-6" />,
      color: "bg-purple-500",
      path: "/admin/unified-slide-management"
    },
    {
      id: "communications",
      title: "Communications",
      description: "Send announcements & news",
      icon: <Bell className="h-6 w-6" />,
      color: "bg-red-500",
      path: "/admin/news-items"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          Priority Actions
          <Badge variant="secondary" className="text-xs">
            Most Used
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {priorityActions.map((action) => (
            <div
              key={action.id}
              className="group cursor-pointer flex flex-col items-center justify-center p-6 border rounded-lg transition-all duration-200 hover:border-glee-spelman/20 hover:bg-glee-spelman/5 hover:shadow-md hover:scale-105"
              onClick={() => navigate(action.path)}
            >
              <div className={`${action.color} text-white p-4 rounded-lg group-hover:scale-110 transition-transform duration-200 mb-4`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-center group-hover:text-glee-spelman transition-colors duration-200 leading-tight mb-2">
                {action.title}
              </span>
              <span className="text-xs text-muted-foreground text-center leading-tight">
                {action.description}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

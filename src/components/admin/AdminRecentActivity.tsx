
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Activity,
  Calendar,
  Upload,
  UserPlus,
  Settings,
  Clock
} from "lucide-react";

interface AdminRecentActivityProps {
  isMobile?: boolean;
}

export function AdminRecentActivity({ isMobile = false }: AdminRecentActivityProps) {
  const activities = [
    {
      id: 1,
      type: "event",
      title: "New performance scheduled",
      description: "Spring Concert 2024 added to calendar",
      user: "Sarah Johnson",
      avatar: "",
      time: "2 hours ago",
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      id: 2,
      type: "upload",
      title: "Media files uploaded",
      description: "15 photos from rehearsal added",
      user: "Michael Chen",
      avatar: "",
      time: "4 hours ago",
      icon: Upload,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      id: 3,
      type: "member",
      title: "New member joined",
      description: "Emily Rodriguez accepted invitation",
      user: "System",
      avatar: "",
      time: "1 day ago",
      icon: UserPlus,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      id: 4,
      type: "settings",
      title: "Settings updated",
      description: "Notification preferences changed",
      user: "David Park",
      avatar: "",
      time: "2 days ago",
      icon: Settings,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Activity className="h-5 w-5 text-orange-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
              >
                <div className={`p-2 rounded-lg ${activity.bgColor} group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {activity.user}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

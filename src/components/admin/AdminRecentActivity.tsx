
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Activity,
  Calendar,
  Upload,
  UserPlus,
  Settings,
  Clock
} from "lucide-react";
import { useRecentActivity } from "@/hooks/useRecentActivity";

interface AdminRecentActivityProps {
  isMobile?: boolean;
}

export function AdminRecentActivity({ isMobile = false }: AdminRecentActivityProps) {
  const { data: activities = [], isLoading, error } = useRecentActivity();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar': return Calendar;
      case 'Upload': return Upload;
      case 'UserPlus': return UserPlus;
      case 'Settings': return Settings;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-gray-100">
            <Activity className="h-5 w-5 text-orange-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg animate-pulse">
                <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600">
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-500 rounded"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-gray-100">
            <Activity className="h-5 w-5 text-orange-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load recent activity</p>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-gray-100">
            <Activity className="h-5 w-5 text-orange-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-gray-100">
          <Activity className="h-5 w-5 text-orange-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.icon);
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
                    <h4 className="font-medium text-navy-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
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

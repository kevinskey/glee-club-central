
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  FileImage, 
  Package,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface AdminStatsCardsProps {
  isMobile?: boolean;
}

export function AdminStatsCards({ isMobile = false }: AdminStatsCardsProps) {
  const stats = [
    {
      title: "Active Members",
      value: "85",
      change: "+5",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Events This Month",
      value: "12",
      change: "+3",
      changeType: "positive" as const,
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Media Files",
      value: "342",
      change: "+18",
      changeType: "positive" as const,
      icon: FileImage,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Pending Orders",
      value: "12",
      change: "-3",
      changeType: "negative" as const,
      icon: Package,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.changeType === 'positive' ? TrendingUp : TrendingDown;
        
        return (
          <Card 
            key={index} 
            className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} transition-colors duration-200`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  } transition-colors duration-200`}
                >
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

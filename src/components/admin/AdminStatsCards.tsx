
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
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

interface StatsData {
  activeMembers: number;
  eventsThisMonth: number;
  mediaFiles: number;
  pendingOrders: number;
}

export function AdminStatsCards({ isMobile = false }: AdminStatsCardsProps) {
  const [statsData, setStatsData] = useState<StatsData>({
    activeMembers: 0,
    eventsThisMonth: 0,
    mediaFiles: 0,
    pendingOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch active members count
        const { count: membersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch events this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('start_time', startOfMonth.toISOString())
          .lte('start_time', endOfMonth.toISOString());

        // Fetch media files count
        const { count: mediaCount } = await supabase
          .from('media_library')
          .select('*', { count: 'exact', head: true });

        // Fetch pending orders count
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        setStatsData({
          activeMembers: membersCount || 0,
          eventsThisMonth: eventsCount || 0,
          mediaFiles: mediaCount || 0,
          pendingOrders: ordersCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Active Members",
      value: isLoading ? "..." : statsData.activeMembers.toString(),
      change: "",
      changeType: "neutral" as const,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Events This Month",
      value: isLoading ? "..." : statsData.eventsThisMonth.toString(),
      change: "",
      changeType: "neutral" as const,
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Media Files",
      value: isLoading ? "..." : statsData.mediaFiles.toString(),
      change: "",
      changeType: "neutral" as const,
      icon: FileImage,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Pending Orders",
      value: isLoading ? "..." : statsData.pendingOrders.toString(),
      change: "",
      changeType: "neutral" as const,
      icon: Package,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className={`grid gap-3 ${isMobile ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-4'}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card 
            key={index} 
            className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
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

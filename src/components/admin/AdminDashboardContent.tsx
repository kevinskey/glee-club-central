import React from "react";
import { UnifiedAdminModules } from "./UnifiedAdminModules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Calendar, BarChart3, Settings } from "lucide-react";

export function AdminDashboardContent() {
  const { profile } = useAuth();

  const quickStats = [
    {
      title: "Total Members",
      value: "42",
      icon: Users,
      change: "+3 this month",
      color: "text-blue-600",
    },
    {
      title: "Upcoming Events",
      value: "8",
      icon: Calendar,
      change: "2 this week",
      color: "text-green-600",
    },
    {
      title: "Analytics Views",
      value: "1,234",
      icon: BarChart3,
      change: "+12% this week",
      color: "text-purple-600",
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: Settings,
      change: "All systems operational",
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-navy-900 dark:text-white font-playfair">
          Welcome back, {profile?.first_name || "Admin"}! 👋
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Admin Access
        </Badge>
      </div>

      {/* Admin Modules */}
      <div className="mb-8">
        <UnifiedAdminModules />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                <CardTitle className="text-xs font-medium text-navy-900 dark:text-white">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-2">
                <div className="text-lg font-bold text-navy-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

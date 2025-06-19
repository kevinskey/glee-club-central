
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Play, Upload, Eye } from 'lucide-react';
import { YouTubeVideoAdmin } from "@/components/admin/YouTubeVideoAdmin";

export default function AdminVideosPage() {
  const videoStats = [
    {
      title: 'Total Videos',
      value: '23',
      icon: Video,
      change: '+3 this month',
      color: 'text-blue-600'
    },
    {
      title: 'Total Views',
      value: '8,450',
      icon: Eye,
      change: '+245 this week',
      color: 'text-green-600'
    },
    {
      title: 'Recent Uploads',
      value: '2',
      icon: Upload,
      change: 'This week',
      color: 'text-purple-600'
    },
    {
      title: 'Avg. Duration',
      value: '3m 45s',
      icon: Play,
      change: 'Performance videos',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-navy-900 dark:text-white font-playfair">
          Video Management
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Video Content
        </Badge>
      </div>

      {/* Video Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {videoStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                <CardTitle className="text-xs font-medium text-gray-900 dark:text-white">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-2">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* YouTube Video Admin Component */}
      <div className="mb-8">
        <YouTubeVideoAdmin />
      </div>
    </div>
  );
}

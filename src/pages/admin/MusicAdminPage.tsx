
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Upload, List } from 'lucide-react';
import { MusicPlayerAdmin } from "@/components/admin/MusicPlayerAdmin";

export default function MusicAdminPage() {
  const musicStats = [
    {
      title: 'Total Tracks',
      value: '156',
      icon: Music,
      change: '+8 this month',
      color: 'text-blue-600'
    },
    {
      title: 'Active Playlists',
      value: '12',
      icon: List,
      change: '+2 this week',
      color: 'text-green-600'
    },
    {
      title: 'Total Plays',
      value: '2,847',
      icon: Play,
      change: '+145 this week',
      color: 'text-purple-600'
    },
    {
      title: 'Recent Uploads',
      value: '5',
      icon: Upload,
      change: 'This week',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-playfair">
          Music Administration
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Music Management
        </Badge>
      </div>

      {/* Music Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {musicStats.map((stat, index) => {
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

      {/* Music Player Admin Component */}
      <div className="mb-8">
        <MusicPlayerAdmin />
      </div>
    </div>
  );
}

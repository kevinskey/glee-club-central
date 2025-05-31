
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Users, TrendingUp, Download, Music } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

interface Fan {
  id: string;
  full_name: string;
  email: string;
  favorite_memory: string | null;
  created_at: string;
}

interface FavoriteMemoryStats {
  memory: string;
  count: number;
}

interface DailySignup {
  date: string;
  count: number;
}

export default function FanAnalyticsPage() {
  const [fans, setFans] = useState<Fan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalFans, setTotalFans] = useState(0);
  const [newSignupsThisWeek, setNewSignupsThisWeek] = useState(0);
  const [favoriteMemoryStats, setFavoriteMemoryStats] = useState<FavoriteMemoryStats[]>([]);
  const [recentFans, setRecentFans] = useState<Fan[]>([]);
  const [weeklySignups, setWeeklySignups] = useState<DailySignup[]>([]);

  useEffect(() => {
    fetchFanAnalytics();
  }, []);

  const fetchFanAnalytics = async () => {
    try {
      setIsLoading(true);

      // Fetch all fans
      const { data: allFans, error: fansError } = await supabase
        .from('fans')
        .select('*')
        .order('created_at', { ascending: false });

      if (fansError) throw fansError;

      setFans(allFans || []);
      setTotalFans(allFans?.length || 0);

      // Calculate new signups in the past 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentSignups = allFans?.filter(fan => 
        new Date(fan.created_at) >= sevenDaysAgo
      ) || [];
      setNewSignupsThisWeek(recentSignups.length);

      // Get recent 5 fans
      setRecentFans(allFans?.slice(0, 5) || []);

      // Process favorite memories
      const memoryStats: { [key: string]: number } = {};
      allFans?.forEach(fan => {
        if (fan.favorite_memory && fan.favorite_memory.trim()) {
          const memory = fan.favorite_memory.trim();
          memoryStats[memory] = (memoryStats[memory] || 0) + 1;
        }
      });

      const sortedMemories = Object.entries(memoryStats)
        .map(([memory, count]) => ({ memory, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setFavoriteMemoryStats(sortedMemories);

      // Generate weekly signup data for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailySignups: { [key: string]: number } = {};
      
      // Initialize all days with 0
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailySignups[dateStr] = 0;
      }

      // Count actual signups
      allFans?.forEach(fan => {
        const fanDate = new Date(fan.created_at);
        if (fanDate >= thirtyDaysAgo) {
          const dateStr = fanDate.toISOString().split('T')[0];
          dailySignups[dateStr] = (dailySignups[dateStr] || 0) + 1;
        }
      });

      const weeklyData = Object.entries(dailySignups)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setWeeklySignups(weeklyData);

    } catch (error) {
      console.error('Error fetching fan analytics:', error);
      toast.error('Failed to load fan analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (fans.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Full Name', 'Email', 'Favorite Memory', 'Joined Date'];
    const csvContent = [
      headers.join(','),
      ...fans.map(fan => [
        `"${fan.full_name}"`,
        `"${fan.email}"`,
        `"${fan.favorite_memory || ''}"`,
        `"${new Date(fan.created_at).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `glee-fans-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Fan data exported successfully');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading fan analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-glee-purple">Fan Analytics</h1>
          <p className="text-muted-foreground">Real-time metrics from our fan community</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glee-purple">{totalFans}</div>
            <p className="text-xs text-muted-foreground">
              Registered fan community members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glee-spelman">{newSignupsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Signups in the last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memories Shared</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glee-gold">{favoriteMemoryStats.length}</div>
            <p className="text-xs text-muted-foreground">
              Unique favorite memories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Signups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Signup Trends</CardTitle>
            <CardDescription>Fan signups over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklySignups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [value, 'Signups']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8B2635" 
                    strokeWidth={2}
                    dot={{ fill: '#8B2635', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Memories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Favorite Memories</CardTitle>
            <CardDescription>Most mentioned memories by fans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={favoriteMemoryStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="memory" 
                    tick={{ fontSize: 10 }}
                    width={120}
                    tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                  />
                  <Tooltip 
                    formatter={(value) => [value, 'Mentions']}
                    labelFormatter={(value) => `Memory: ${value}`}
                  />
                  <Bar dataKey="count" fill="#D4A574" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Fan Signups</CardTitle>
          <CardDescription>Latest 5 fans who joined our community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Name</th>
                  <th className="text-left py-2 px-2">Email</th>
                  <th className="text-left py-2 px-2 hidden sm:table-cell">Favorite Memory</th>
                  <th className="text-left py-2 px-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentFans.map((fan) => (
                  <tr key={fan.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 font-medium">{fan.full_name}</td>
                    <td className="py-2 px-2 text-muted-foreground">{fan.email}</td>
                    <td className="py-2 px-2 hidden sm:table-cell">
                      <div className="max-w-[200px] truncate">
                        {fan.favorite_memory || 'Not provided'}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {new Date(fan.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentFans.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No fan signups yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

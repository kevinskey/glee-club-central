
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Users, TrendingUp, Download, Music } from 'lucide-react';
import { toast } from 'sonner';

// Import our modular components
import { FanStatsCard } from '@/components/analytics/FanStatsCard';
import { SignupChart } from '@/components/analytics/SignupChart';
import { FavoriteMemoriesList } from '@/components/analytics/FavoriteMemoriesList';
import { RecentFansTable } from '@/components/analytics/RecentFansTable';

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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Fan Analytics"
        description="Real-time metrics from our fan community"
        actions={
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <FanStatsCard
          title="Total Fans"
          value={totalFans}
          description="Registered fan community members"
          icon={<Users />}
          isLoading={isLoading}
        />
        <FanStatsCard
          title="New This Week"
          value={newSignupsThisWeek}
          description="Signups in the last 7 days"
          icon={<TrendingUp />}
          isLoading={isLoading}
        />
        <FanStatsCard
          title="Memories Shared"
          value={favoriteMemoryStats.length}
          description="Unique favorite memories"
          icon={<Music />}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignupChart data={weeklySignups} isLoading={isLoading} />
        <FavoriteMemoriesList data={favoriteMemoryStats} isLoading={isLoading} />
      </div>

      {/* Recent Signups Table */}
      <RecentFansTable data={recentFans} isLoading={isLoading} />
    </div>
  );
}

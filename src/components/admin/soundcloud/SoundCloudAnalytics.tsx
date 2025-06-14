
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Play, Heart, Eye, TrendingUp, Users, Calendar, Music, Share2 } from 'lucide-react';
import { useSoundCloudPlayer } from '@/hooks/useSoundCloudPlayer';
import { SoundCloudStats } from './SoundCloudStats';

export function SoundCloudAnalytics() {
  const { tracks, playlists, isLoading } = useSoundCloudPlayer();

  // Mock analytics data - in a real implementation, this would come from SoundCloud API
  const weeklyPlays = [
    { day: 'Mon', plays: 120, likes: 15 },
    { day: 'Tue', plays: 89, likes: 12 },
    { day: 'Wed', plays: 156, likes: 23 },
    { day: 'Thu', plays: 203, likes: 31 },
    { day: 'Fri', plays: 178, likes: 28 },
    { day: 'Sat', plays: 245, likes: 42 },
    { day: 'Sun', plays: 198, likes: 35 },
  ];

  const topTracks = tracks.slice(0, 5).map((track, index) => ({
    title: track.title,
    plays: Math.floor(Math.random() * 1000) + 100,
    rank: index + 1
  }));

  const genreData = [
    { name: 'Gospel', value: 35, color: '#8884d8' },
    { name: 'Classical', value: 25, color: '#82ca9d' },
    { name: 'Spiritual', value: 20, color: '#ffc658' },
    { name: 'Contemporary', value: 15, color: '#ff7c7c' },
    { name: 'Other', value: 5, color: '#8dd1e1' },
  ];

  const totalPlays = tracks.reduce((sum, track) => sum + (track.plays || 0), 0);
  const totalLikes = tracks.reduce((sum, track) => sum + (track.likes || 0), 0);
  const avgEngagement = totalPlays > 0 ? ((totalLikes / totalPlays) * 100).toFixed(1) : '0.0';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalPlays.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Plays</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{totalLikes.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{avgEngagement}%</p>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{tracks.length}</p>
                <p className="text-sm text-muted-foreground">Active Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track Stats */}
      {tracks.length > 0 && <SoundCloudStats tracks={tracks} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyPlays}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="plays" fill="#8884d8" name="Plays" />
                <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Genre Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {genreData.map((genre, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: genre.color }}
                  ></div>
                  <span className="text-sm">{genre.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Tracks */}
      {topTracks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Performing Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTracks.map((track) => (
                <div key={track.title} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {track.rank}
                    </div>
                    <div>
                      <p className="font-medium">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.plays.toLocaleString()} plays</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{track.plays}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyPlays}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="plays" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Plays"
              />
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Likes"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-lg font-semibold">1,234</p>
                <p className="text-sm text-muted-foreground">Unique Listeners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-lg font-semibold">89</p>
                <p className="text-sm text-muted-foreground">Total Shares</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-lg font-semibold">5.2 min</p>
                <p className="text-sm text-muted-foreground">Avg. Listen Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

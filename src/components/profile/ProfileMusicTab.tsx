
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, BookOpen, Clock, Star } from "lucide-react";

interface ProfileMusicTabProps {
  profile: any;
}

export const ProfileMusicTab: React.FC<ProfileMusicTabProps> = ({ profile }) => {
  const musicData = {
    voicePart: profile?.voice_part || 'Not assigned',
    favoriteGenre: 'Gospel',
    practiceHours: 24,
    songsMastered: 12,
    currentRepertoire: [
      { title: 'Amazing Grace', composer: 'Traditional', status: 'mastered' },
      { title: 'Lift Every Voice', composer: 'J. Johnson', status: 'learning' },
      { title: 'Wade in the Water', composer: 'Traditional', status: 'mastered' },
      { title: 'Precious Lord', composer: 'T. Dorsey', status: 'review' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'learning':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'review':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Single Column */}
      <div className="block sm:hidden space-y-4">
        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Music Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{musicData.voicePart}</div>
                <div className="text-xs text-blue-600">Voice Part</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{musicData.songsMastered}</div>
                <div className="text-xs text-green-600">Songs Mastered</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{musicData.practiceHours}h</div>
                <div className="text-xs text-purple-600">Practice This Month</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{musicData.favoriteGenre}</div>
                <div className="text-xs text-orange-600">Favorite Genre</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Repertoire Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Current Repertoire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {musicData.currentRepertoire.map((song, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{song.title}</p>
                    <p className="text-xs text-muted-foreground">{song.composer}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(song.status)}>
                    {song.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Two Column Layout */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Musical Profile
                </CardTitle>
                <CardDescription>
                  Your musical journey and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{musicData.voicePart}</div>
                      <div className="text-sm text-blue-600">Voice Part</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{musicData.songsMastered}</div>
                      <div className="text-sm text-green-600">Songs Mastered</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{musicData.practiceHours}h</div>
                      <div className="text-sm text-purple-600">Practice This Month</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{musicData.favoriteGenre}</div>
                      <div className="text-sm text-orange-600">Favorite Genre</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Musical Achievements
                </CardTitle>
                <CardDescription>
                  Your musical milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h4 className="font-medium text-sm">Solo Performance</h4>
                      <p className="text-xs text-muted-foreground">Performed solo in Spring Concert</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Music className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-sm">Quick Learner</h4>
                      <p className="text-xs text-muted-foreground">Mastered 5 songs this semester</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium text-sm">Dedicated Practicer</h4>
                      <p className="text-xs text-muted-foreground">20+ hours practice monthly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Repertoire */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Current Repertoire
                </CardTitle>
                <CardDescription>
                  Songs you're currently working on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {musicData.currentRepertoire.map((song, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-muted-foreground">{song.composer}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(song.status)}>
                        {song.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

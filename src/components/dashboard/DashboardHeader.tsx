
import React from 'react';
import { User, Crown, Music } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthUser, Profile } from '@/types/auth';

interface DashboardHeaderProps {
  user: AuthUser;
  profile: Profile | null;
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const displayName = profile?.first_name || 
                     user?.email?.split('@')[0] || 
                     'Member';

  const lastName = profile?.last_name || '';
  const fullName = lastName ? `${displayName} ${lastName}` : displayName;
  const memberRole = profile?.role || 'member';
  const memberStatus = profile?.status || 'active';
  const voicePart = profile?.voice_part || null;

  const getVoicePartDisplay = (part: string) => {
    const voicePartMap: { [key: string]: string } = {
      'soprano_1': 'Soprano I',
      'soprano_2': 'Soprano II', 
      'alto_1': 'Alto I',
      'alto_2': 'Alto II',
      'tenor': 'Tenor',
      'bass': 'Bass'
    };
    return voicePartMap[part] || part;
  };

  return (
    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
      {/* Welcome Header */}
      <div className="text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {displayName}!
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                {memberRole.charAt(0).toUpperCase() + memberRole.slice(1)}
              </Badge>
              {voicePart && (
                <Badge variant="secondary" className="text-xs">
                  <Music className="w-3 h-3 mr-1" />
                  {getVoicePartDisplay(voicePart)}
                </Badge>
              )}
              <Badge variant={memberStatus === 'active' ? 'default' : 'secondary'} className="text-xs">
                {memberStatus.charAt(0).toUpperCase() + memberStatus.slice(1)}
              </Badge>
              {profile?.is_super_admin && (
                <Badge variant="destructive" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">Spelman College Glee Club</p>
            <p className="text-xs text-gray-500 italic">"To Amaze and Inspire"</p>
          </div>
        </div>
      </div>

      {/* Profile Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-blue-600" />
            Member Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <span className="font-medium text-gray-700">Full Name:</span>
              <p className="text-gray-900">{fullName}</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900 truncate">{user.email}</p>
            </div>
            {voicePart && (
              <div className="space-y-1">
                <span className="font-medium text-gray-700">Voice Part:</span>
                <p className="text-gray-900">{getVoicePartDisplay(voicePart)}</p>
              </div>
            )}
            {profile?.class_year && (
              <div className="space-y-1">
                <span className="font-medium text-gray-700">Class Year:</span>
                <p className="text-gray-900">{profile.class_year}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

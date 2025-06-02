
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AuthUser, Profile } from '@/types/auth';

interface ProfileCardProps {
  user: AuthUser;
  profile: Profile | null;
  getInitials: () => string;
  getDisplayName: () => string;
}

export function ProfileCard({ user, profile, getInitials, getDisplayName }: ProfileCardProps) {
  const voicePartOptions = [
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={profile?.avatar_url} alt="Profile" />
          <AvatarFallback className="text-2xl font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{getDisplayName()}</CardTitle>
        <p className="text-muted-foreground">{user?.email}</p>
        {profile?.role && (
          <Badge variant="outline" className="mt-2">
            {profile.role.replace('_', ' ')}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {profile?.voice_part && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Voice Part:</span>
              <span>{voicePartOptions.find(opt => opt.value === profile.voice_part)?.label || profile.voice_part}</span>
            </div>
          )}
          {profile?.class_year && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class Year:</span>
              <span>{profile.class_year}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since:</span>
            <span>{new Date(profile?.created_at || user?.created_at || '').toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

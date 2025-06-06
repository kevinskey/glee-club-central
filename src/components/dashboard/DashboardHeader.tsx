
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          Member Dashboard • {memberRole} • {memberStatus}
        </p>
      </div>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Full Name:</span> {fullName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Role:</span> {memberRole}
            </div>
            <div>
              <span className="font-medium">Status:</span> {memberStatus}
            </div>
            {profile?.voice_part && (
              <div>
                <span className="font-medium">Voice Part:</span> {profile.voice_part}
              </div>
            )}
            {profile?.class_year && (
              <div>
                <span className="font-medium">Class Year:</span> {profile.class_year}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Settings, Share, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedProfileHeaderProps {
  profile: any;
  user: any;
  isEditing: boolean;
  onToggleEdit: () => void;
  onShare?: () => void;
  onSettings?: () => void;
}

export const EnhancedProfileHeader: React.FC<EnhancedProfileHeaderProps> = ({
  profile,
  user,
  isEditing,
  onToggleEdit,
  onShare,
  onSettings
}) => {
  const getInitials = (profile: any) => {
    const first = profile?.first_name?.[0] || '';
    const last = profile?.last_name?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url} alt="Profile picture" />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(profile)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn("w-2 h-2 rounded-full", getStatusColor(profile?.status || 'active'))} />
                <span className="text-xs capitalize">{profile?.status || 'Active'}</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={onToggleEdit}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onSettings}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Mobile Stats */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-green-600">95%</div>
              <div className="text-xs text-muted-foreground">Attendance</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-blue-600">{profile?.voice_part || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Voice Part</div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url} alt="Profile picture" />
                <AvatarFallback className="text-xl font-semibold">
                  {getInitials(profile)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full", getStatusColor(profile?.status || 'active'))} />
                    {profile?.status || 'Active'}
                  </Badge>
                  {profile?.voice_part && (
                    <Badge variant="secondary">{profile.voice_part}</Badge>
                  )}
                  {profile?.role && profile.role !== 'member' && (
                    <Badge>{profile.role}</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={onToggleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onSettings}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Desktop Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-muted-foreground">Attendance</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-muted-foreground">Concerts</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-muted-foreground">Events</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4.8</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

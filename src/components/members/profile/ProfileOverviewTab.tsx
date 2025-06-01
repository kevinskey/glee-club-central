
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Music, 
  GraduationCap,
  MapPin,
  Edit
} from 'lucide-react';
import { useAuthMigration } from '@/hooks/useAuthMigration';

interface ProfileOverviewTabProps {
  memberId: string;
}

export function ProfileOverviewTab({ memberId }: ProfileOverviewTabProps) {
  const { refreshProfile, profile } = useAuthMigration();

  const handleRefresh = async () => {
    if (refreshProfile) {
      await refreshProfile();
    }
  };

  // Mock member data - in real implementation this would be fetched based on memberId
  const memberData = {
    id: memberId,
    first_name: "Sample",
    last_name: "Member", 
    email: "sample@example.com",
    voice_part: "Soprano",
    status: "active",
    join_date: "2023-09-01",
    class_year: "2025",
    phone: "(555) 123-4567",
    avatar_url: null
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={memberData.avatar_url || undefined} />
              <AvatarFallback className="text-lg">
                {memberData.first_name[0]}{memberData.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {memberData.first_name} {memberData.last_name}
              </h2>
              <p className="text-muted-foreground">{memberData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{memberData.voice_part}</Badge>
                <Badge variant={memberData.status === 'active' ? 'default' : 'secondary'}>
                  {memberData.status}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={handleRefresh}>
              <Edit className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{memberData.email}</span>
            </div>
            {memberData.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{memberData.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Joined {memberData.join_date}</span>
            </div>
            {memberData.class_year && (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Class of {memberData.class_year}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Choir Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Voice Part</label>
              <p className="text-sm text-muted-foreground">{memberData.voice_part}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="text-sm text-muted-foreground capitalize">{memberData.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Member Since</label>
              <p className="text-sm text-muted-foreground">{memberData.join_date}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

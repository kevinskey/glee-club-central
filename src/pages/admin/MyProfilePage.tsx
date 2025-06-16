
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Music, 
  GraduationCap,
  Settings,
  Shield,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/ui/user-avatar';

export default function MyProfilePage() {
  const { profile, user } = useAuth();

  if (!profile || !user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <UserAvatar user={profile} size="xl" className="h-24 w-24" />
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={profile.role === 'admin' ? 'destructive' : 'outline'}>
                  {profile.is_super_admin ? 'Super Admin' : profile.role || 'Member'}
                </Badge>
                {profile.status && (
                  <Badge variant={profile.status === 'active' ? 'default' : 'secondary'}>
                    {profile.status}
                  </Badge>
                )}
                {profile.dues_paid && (
                  <Badge variant="default" className="bg-green-600">
                    Dues Paid
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="mt-1">{profile.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Join Date</label>
              <p className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {profile.join_date ? new Date(profile.join_date).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Musical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Voice Part</label>
              <p className="mt-1">{profile.voice_part || 'Not assigned'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Class Year</label>
              <p className="mt-1 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                {profile.class_year || 'Not set'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Administrative Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Created</label>
              <p className="mt-1">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="mt-1">
                {profile.updated_at 
                  ? new Date(profile.updated_at).toLocaleDateString()
                  : 'Never'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <p className="mt-1 font-mono text-sm">{profile.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Balance</label>
              <p className="mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                ${profile.account_balance || '0.00'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {profile.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{profile.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

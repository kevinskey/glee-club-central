
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Music, 
  GraduationCap,
  DollarSign,
  ArrowLeft,
  Edit,
  Shield
} from 'lucide-react';

interface UserProfileViewProps {
  user: any;
  onBack: () => void;
  onEdit: () => void;
}

export function UserProfileView({ user, onBack, onEdit }: UserProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="text-muted-foreground">View detailed user information</p>
          </div>
        </div>
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
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
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-2xl">
                {`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.email || 'No email provided'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                  {user.is_super_admin ? 'Super Admin' : user.role || 'Member'}
                </Badge>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status || 'Active'}
                </Badge>
                {user.dues_paid && (
                  <Badge variant="default" className="bg-green-600">
                    Dues Paid
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Personal Info */}
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
              <p className="mt-1">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Join Date</label>
              <p className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {user.join_date ? new Date(user.join_date).toLocaleDateString() : 'Not set'}
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
              <p className="mt-1">{user.voice_part || 'Not assigned'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Class Year</label>
              <p className="mt-1 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                {user.class_year || 'Not set'}
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
            Administrative Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Balance</label>
              <p className="mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                ${user.account_balance || '0.00'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
              <p className="mt-1">
                {user.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="mt-1">
                {new Date(user.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated</label>
              <p className="mt-1">
                {user.updated_at 
                  ? new Date(user.updated_at).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {user.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{user.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

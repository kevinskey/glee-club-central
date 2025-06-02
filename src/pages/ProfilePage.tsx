
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Save, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Profile } from '@/types/auth';

export default function ProfilePage() {
  const { user, profile, isLoading, isInitialized, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Create a properly typed default profile
  const defaultProfile: Partial<Profile> = {
    first_name: '',
    last_name: '',
    phone: '',
    voice_part: '',
    class_year: '',
    notes: ''
  };
  
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>(profile || defaultProfile);

  // Wait for initialization
  if (!isInitialized) {
    return <PageLoader message="Loading profile..." className="min-h-screen" />;
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Wait for profile to load
  if (isLoading) {
    return <PageLoader message="Loading your profile..." className="min-h-screen" />;
  }

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || 'User';
  };

  const handleEdit = () => {
    setEditedProfile(profile || defaultProfile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile || defaultProfile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would typically update the profile via API
      // For now, we'll just refresh the profile
      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const voicePartOptions = [
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your profile information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={profile?.avatar_url} alt="Profile" />
                  <AvatarFallback className="text-2xl font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{getDisplayName()}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
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
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      {isEditing ? 'Edit your profile information' : 'View your profile details'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="first_name"
                        value={editedProfile.first_name || ''}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <div className="py-2 px-3 bg-muted rounded text-sm">
                        {profile?.first_name || 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="last_name"
                        value={editedProfile.last_name || ''}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <div className="py-2 px-3 bg-muted rounded text-sm">
                        {profile?.last_name || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="py-2 px-3 bg-muted rounded text-sm">
                    {user?.email || 'Not provided'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedProfile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="py-2 px-3 bg-muted rounded text-sm">
                      {profile?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice_part">Voice Part</Label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.voice_part || ''}
                      onValueChange={(value) => handleInputChange('voice_part', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice part" />
                      </SelectTrigger>
                      <SelectContent>
                        {voicePartOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="py-2 px-3 bg-muted rounded text-sm">
                      {voicePartOptions.find(opt => opt.value === profile?.voice_part)?.label || profile?.voice_part || 'Not assigned'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class_year">Class Year</Label>
                  {isEditing ? (
                    <Input
                      id="class_year"
                      value={editedProfile.class_year || ''}
                      onChange={(e) => handleInputChange('class_year', e.target.value)}
                      placeholder="Enter class year (e.g., 2025)"
                    />
                  ) : (
                    <div className="py-2 px-3 bg-muted rounded text-sm">
                      {profile?.class_year || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  {isEditing ? (
                    <Textarea
                      id="notes"
                      value={editedProfile.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      placeholder="Add any additional notes..."
                    />
                  ) : (
                    <div className="py-2 px-3 bg-muted rounded text-sm min-h-[80px]">
                      {profile?.notes || 'No notes'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

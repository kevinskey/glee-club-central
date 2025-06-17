
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Music, 
  GraduationCap, 
  DollarSign, 
  Edit, 
  Save, 
  X,
  Shield
} from 'lucide-react';

interface ProfileData {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  voice_part?: string;
  avatar_url?: string;
  status?: string;
  class_year?: string;
  notes?: string;
  special_roles?: string;
  is_super_admin?: boolean;
  title?: string;
  disabled?: boolean;
  updated_at?: string;
  join_date?: string;
  dues_paid?: boolean;
  role_tags?: string[];
  created_at?: string;
  account_balance?: number;
  ecommerce_enabled?: boolean;
  design_history_ids?: string[];
  current_cart_id?: string;
  default_shipping_address?: string;
  music_role?: string;
  org?: string;
  is_exec_board?: boolean;
  exec_board_role?: string;
}

interface UnifiedProfileManagerProps {
  viewMode?: 'view' | 'edit';
  targetUserId?: string;
  onProfileUpdate?: () => void;
}

export function UnifiedProfileManager({ 
  viewMode = 'view', 
  targetUserId,
  onProfileUpdate 
}: UnifiedProfileManagerProps) {
  const { profile: currentProfile, isAdmin, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(viewMode === 'edit');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [targetProfile, setTargetProfile] = useState<ProfileData | null>(null);

  // Determine which profile to show
  const displayProfile = targetUserId && targetProfile ? targetProfile : (currentProfile as ProfileData);
  const isOwnProfile = !targetUserId || targetUserId === currentProfile?.id;
  const canEdit = isOwnProfile || isAdmin();

  React.useEffect(() => {
    if (targetUserId && targetUserId !== currentProfile?.id) {
      fetchTargetProfile();
    } else if (currentProfile) {
      setProfileData(currentProfile as ProfileData);
    }
  }, [targetUserId, currentProfile]);

  const fetchTargetProfile = async () => {
    if (!targetUserId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();
      
      if (error) throw error;
      
      setTargetProfile(data as ProfileData);
      setProfileData(data as ProfileData);
    } catch (error) {
      console.error('Error fetching target profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleSave = async () => {
    if (!displayProfile?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', displayProfile.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
      
      if (isOwnProfile) {
        await refreshProfile();
      } else {
        await fetchTargetProfile();
      }
      
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(displayProfile || {});
    setIsEditing(false);
  };

  const updateField = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (!displayProfile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No profile data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isOwnProfile ? 'My Profile' : `${displayProfile.first_name} ${displayProfile.last_name}`}
          </h1>
          <p className="text-muted-foreground">
            {isOwnProfile ? 'Manage your account information' : 'View member profile'}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={profileData.first_name || ''}
                  onChange={(e) => updateField('first_name', e.target.value)}
                />
              ) : (
                <p className="mt-1">{displayProfile.first_name || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={profileData.last_name || ''}
                  onChange={(e) => updateField('last_name', e.target.value)}
                />
              ) : (
                <p className="mt-1">{displayProfile.last_name || 'Not provided'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              ) : (
                <p className="mt-1 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {displayProfile.phone || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="class_year">Class Year</Label>
              {isEditing ? (
                <Input
                  id="class_year"
                  value={profileData.class_year || ''}
                  onChange={(e) => updateField('class_year', e.target.value)}
                  placeholder="e.g., 2025"
                />
              ) : (
                <p className="mt-1 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {displayProfile.class_year || 'Not set'}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant={displayProfile.role === 'admin' ? 'destructive' : 'outline'}>
              {displayProfile.is_super_admin ? 'Super Admin' : displayProfile.role || 'Member'}
            </Badge>
            <Badge variant={displayProfile.status === 'active' ? 'default' : 'secondary'}>
              {displayProfile.status || 'Active'}
            </Badge>
            {displayProfile.dues_paid && (
              <Badge variant="default" className="bg-green-600">
                Dues Paid
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Musical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Musical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voice_part">Voice Part</Label>
              {isEditing ? (
                <Select 
                  value={profileData.voice_part || ''} 
                  onValueChange={(value) => updateField('voice_part', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice part" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soprano_1">Soprano 1</SelectItem>
                    <SelectItem value="soprano_2">Soprano 2</SelectItem>
                    <SelectItem value="alto_1">Alto 1</SelectItem>
                    <SelectItem value="alto_2">Alto 2</SelectItem>
                    <SelectItem value="tenor">Tenor</SelectItem>
                    <SelectItem value="bass">Bass</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1">{displayProfile.voice_part || 'Not assigned'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="join_date">Join Date</Label>
              {isEditing ? (
                <Input
                  id="join_date"
                  type="date"
                  value={profileData.join_date || ''}
                  onChange={(e) => updateField('join_date', e.target.value)}
                />
              ) : (
                <p className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {displayProfile.join_date ? new Date(displayProfile.join_date).toLocaleDateString() : 'Not set'}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Administrative Information */}
      {(isAdmin() || isOwnProfile) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administrative Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="account_balance">Account Balance</Label>
                {isEditing && isAdmin() ? (
                  <Input
                    id="account_balance"
                    type="number"
                    step="0.01"
                    value={profileData.account_balance || 0}
                    onChange={(e) => updateField('account_balance', parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <p className="mt-1 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    ${displayProfile.account_balance || '0.00'}
                  </p>
                )}
              </div>

              {isAdmin() && (
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="dues_paid"
                    checked={profileData.dues_paid || false}
                    onCheckedChange={(checked) => updateField('dues_paid', checked)}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="dues_paid">Dues Paid</Label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={profileData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Add any additional notes..."
              rows={4}
            />
          ) : (
            <p className="whitespace-pre-wrap">
              {displayProfile.notes || 'No notes available'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, X } from 'lucide-react';
import { Profile, AuthUser } from '@/types/auth';

interface ProfileFormProps {
  user: AuthUser;
  profile: Profile | null;
  isEditing: boolean;
  isSaving: boolean;
  editedProfile: Partial<Profile>;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onInputChange: (field: string, value: string | boolean | number) => void;
}

export function ProfileForm({
  user,
  profile,
  isEditing,
  isSaving,
  editedProfile,
  onEdit,
  onCancel,
  onSave,
  onInputChange
}: ProfileFormProps) {
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Details</CardTitle>
        {!isEditing ? (
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={onSave} disabled={isSaving} size="sm">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm" disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            {isEditing ? (
              <Input
                id="first_name"
                value={editedProfile.first_name || ''}
                onChange={(e) => onInputChange('first_name', e.target.value)}
                placeholder="Enter first name"
              />
            ) : (
              <p className="text-sm py-2 px-3 bg-muted rounded">
                {profile?.first_name || 'Not provided'}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            {isEditing ? (
              <Input
                id="last_name"
                value={editedProfile.last_name || ''}
                onChange={(e) => onInputChange('last_name', e.target.value)}
                placeholder="Enter last name"
              />
            ) : (
              <p className="text-sm py-2 px-3 bg-muted rounded">
                {profile?.last_name || 'Not provided'}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <p className="text-sm py-2 px-3 bg-muted rounded">
            {user?.email || 'Not provided'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          {isEditing ? (
            <Input
              id="phone"
              value={editedProfile.phone || ''}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          ) : (
            <p className="text-sm py-2 px-3 bg-muted rounded">
              {profile?.phone || 'Not provided'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice_part">Voice Part</Label>
          {isEditing ? (
            <Select
              value={editedProfile.voice_part || ''}
              onValueChange={(value) => onInputChange('voice_part', value)}
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
            <p className="text-sm py-2 px-3 bg-muted rounded">
              {voicePartOptions.find(opt => opt.value === profile?.voice_part)?.label || 
               profile?.voice_part || 'Not assigned'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="class_year">Class Year</Label>
          {isEditing ? (
            <Input
              id="class_year"
              value={editedProfile.class_year || ''}
              onChange={(e) => onInputChange('class_year', e.target.value)}
              placeholder="Enter class year (e.g., 2025)"
            />
          ) : (
            <p className="text-sm py-2 px-3 bg-muted rounded">
              {profile?.class_year || 'Not provided'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Bio/Notes</Label>
          {isEditing ? (
            <Textarea
              id="notes"
              value={editedProfile.notes || ''}
              onChange={(e) => onInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-sm py-2 px-3 bg-muted rounded min-h-[80px]">
              {profile?.notes || 'No bio provided'}
            </p>
          )}
        </div>

        {/* Read-only fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>Member Since</Label>
            <p className="text-sm py-2 px-3 bg-muted rounded">
              {profile?.created_at 
                ? new Date(profile.created_at).toLocaleDateString()
                : 'Not available'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <p className="text-sm py-2 px-3 bg-muted rounded capitalize">
              {profile?.status || 'Active'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

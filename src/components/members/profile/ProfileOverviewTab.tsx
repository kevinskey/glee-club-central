
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileOverviewTabProps {
  profile: any;
  isEditable?: boolean;
  onSave?: (updatedProfile: any) => Promise<void>;
}

export const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({ 
  profile, 
  isEditable = false, 
  onSave 
}) => {
  const [editedProfile, setEditedProfile] = useState(profile || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsLoading(true);
    try {
      await onSave(editedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>
          Basic information and membership details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            {isEditable ? (
              <Input
                id="first_name"
                value={editedProfile.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
              />
            ) : (
              <p className="text-sm">{profile?.first_name || 'Not provided'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            {isEditable ? (
              <Input
                id="last_name"
                value={editedProfile.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
              />
            ) : (
              <p className="text-sm">{profile?.last_name || 'Not provided'}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <p className="text-sm">{profile?.email || 'Not provided'}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice_part">Voice Part</Label>
          {isEditable ? (
            <Input
              id="voice_part"
              value={editedProfile.voice_part || ''}
              onChange={(e) => handleInputChange('voice_part', e.target.value)}
            />
          ) : (
            <p className="text-sm">{profile?.voice_part || 'Not assigned'}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          {isEditable ? (
            <Textarea
              id="notes"
              value={editedProfile.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-sm">{profile?.notes || 'No notes'}</p>
          )}
        </div>

        {isEditable && onSave && (
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

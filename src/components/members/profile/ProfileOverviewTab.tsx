
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";
import { getAllRoles } from '@/utils/permissionsMap';

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
  const [newRoleTag, setNewRoleTag] = useState('');

  // Get all available executive roles
  const availableRoles = getAllRoles();

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

  const handleCancel = () => {
    setEditedProfile(profile);
    if (onSave) {
      onSave(null); // Signal cancel
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRoleTag = () => {
    if (newRoleTag.trim() && !editedProfile.role_tags?.includes(newRoleTag.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        role_tags: [...(prev.role_tags || []), newRoleTag.trim()]
      }));
      setNewRoleTag('');
    }
  };

  const removeRoleTag = (tagToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      role_tags: (prev.role_tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const toggleExecutiveRole = (role: string, checked: boolean) => {
    if (checked) {
      setEditedProfile(prev => ({
        ...prev,
        role_tags: [...(prev.role_tags || []), role]
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        role_tags: (prev.role_tags || []).filter(tag => tag !== role)
      }));
    }
  };

  const voicePartOptions = [
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'section_leader', label: 'Section Leader' },
    { value: 'admin', label: 'Admin' }
  ];

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
                placeholder="Enter first name"
              />
            ) : (
              <p className="text-sm py-2 px-3 bg-muted rounded">{profile?.first_name || 'Not provided'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            {isEditable ? (
              <Input
                id="last_name"
                value={editedProfile.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Enter last name"
              />
            ) : (
              <p className="text-sm py-2 px-3 bg-muted rounded">{profile?.last_name || 'Not provided'}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <p className="text-sm py-2 px-3 bg-muted rounded">{profile?.email || 'Not provided'}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          {isEditable ? (
            <Input
              id="phone"
              value={editedProfile.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          ) : (
            <p className="text-sm py-2 px-3 bg-muted rounded">{profile?.phone || 'Not provided'}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice_part">Voice Part</Label>
          {isEditable ? (
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
            <p className="text-sm py-2 px-3 bg-muted rounded">
              {voicePartOptions.find(opt => opt.value === profile?.voice_part)?.label || profile?.voice_part || 'Not assigned'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">System Role</Label>
          {isEditable ? (
            <Select
              value={editedProfile.role || ''}
              onValueChange={(value) => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm py-2 px-3 bg-muted rounded">
              {roleOptions.find(opt => opt.value === profile?.role)?.label || profile?.role || 'Member'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="class_year">Class Year</Label>
          {isEditable ? (
            <Input
              id="class_year"
              value={editedProfile.class_year || ''}
              onChange={(e) => handleInputChange('class_year', e.target.value)}
              placeholder="Enter class year (e.g., 2025)"
            />
          ) : (
            <p className="text-sm py-2 px-3 bg-muted rounded">{profile?.class_year || 'Not provided'}</p>
          )}
        </div>

        {/* Executive Board Roles Section */}
        <div className="space-y-4">
          <Label>Executive Board Roles</Label>
          
          {isEditable ? (
            <div className="space-y-4">
              {/* Executive Role Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableRoles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role}`}
                      checked={(editedProfile.role_tags || []).includes(role)}
                      onCheckedChange={(checked) => toggleExecutiveRole(role, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`role-${role}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {role}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Current Tags Display */}
              <div className="flex flex-wrap gap-2">
                {(editedProfile.role_tags || []).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeRoleTag(tag)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* Add Custom Role */}
              <div className="flex gap-2">
                <Input
                  value={newRoleTag}
                  onChange={(e) => setNewRoleTag(e.target.value)}
                  placeholder="Add custom role..."
                  onKeyPress={(e) => e.key === 'Enter' && addRoleTag()}
                />
                <Button
                  type="button"
                  onClick={addRoleTag}
                  size="sm"
                  disabled={!newRoleTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {(profile?.role_tags || []).map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {(!profile?.role_tags?.length) && (
                  <p className="text-sm text-muted-foreground">No executive roles assigned</p>
                )}
              </div>
            </div>
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
              placeholder="Add any additional notes..."
            />
          ) : (
            <p className="text-sm py-2 px-3 bg-muted rounded min-h-[80px]">{profile?.notes || 'No notes'}</p>
          )}
        </div>

        {isEditable && onSave && (
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline"
              onClick={handleCancel} 
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

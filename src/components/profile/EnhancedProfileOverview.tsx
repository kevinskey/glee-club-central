
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, X, User, Phone, Mail, Calendar, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedProfileOverviewProps {
  profile: any;
  isEditable?: boolean;
  onSave?: (updatedProfile: any) => Promise<void>;
}

export const EnhancedProfileOverview: React.FC<EnhancedProfileOverviewProps> = ({
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

  const handleCancel = () => {
    setEditedProfile(profile);
    if (onSave) {
      onSave(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (profile: any) => {
    const first = profile?.first_name?.[0] || '';
    const last = profile?.last_name?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  const voicePartOptions = [
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  const InfoCard = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Mobile: Single Column Layout */}
      <div className="block sm:hidden space-y-4">
        {/* Profile Photo Card */}
        <InfoCard icon={Camera} title="Profile Photo">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url} alt="Profile picture" />
              <AvatarFallback className="text-lg">{getInitials(profile)}</AvatarFallback>
            </Avatar>
            {isEditable && (
              <Button variant="outline" size="sm" className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            )}
          </div>
        </InfoCard>

        {/* Personal Info Card */}
        <InfoCard icon={User} title="Personal Information">
          <div className="space-y-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              {isEditable ? (
                <Input
                  id="first_name"
                  value={editedProfile.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Enter first name"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                  {profile?.first_name || 'Not provided'}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              {isEditable ? (
                <Input
                  id="last_name"
                  value={editedProfile.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Enter last name"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                  {profile?.last_name || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </InfoCard>

        {/* Contact Info Card */}
        <InfoCard icon={Phone} title="Contact Information">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                {profile?.email || 'Not provided'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              {isEditable ? (
                <Input
                  id="phone"
                  value={editedProfile.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                  {profile?.phone || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </InfoCard>

        {/* Music Info Card */}
        <InfoCard icon={Music2} title="Musical Information">
          <div className="space-y-4">
            <div>
              <Label htmlFor="voice_part">Voice Part</Label>
              {isEditable ? (
                <Select
                  value={editedProfile.voice_part || ''}
                  onValueChange={(value) => handleInputChange('voice_part', value)}
                >
                  <SelectTrigger className="mt-1">
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
                <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                  {voicePartOptions.find(opt => opt.value === profile?.voice_part)?.label || 
                   profile?.voice_part || 'Not assigned'}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="class_year">Class Year</Label>
              {isEditable ? (
                <Input
                  id="class_year"
                  value={editedProfile.class_year || ''}
                  onChange={(e) => handleInputChange('class_year', e.target.value)}
                  placeholder="Enter class year (e.g., 2025)"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                  {profile?.class_year || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </InfoCard>

        {/* Notes Card */}
        <InfoCard icon={User} title="Additional Notes">
          <div>
            <Label htmlFor="notes">Notes</Label>
            {isEditable ? (
              <Textarea
                id="notes"
                value={editedProfile.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                placeholder="Add any additional notes..."
                className="mt-1"
              />
            ) : (
              <p className="text-sm py-2 px-3 bg-muted rounded min-h-[80px] mt-1">
                {profile?.notes || 'No notes'}
              </p>
            )}
          </div>
        </InfoCard>
      </div>

      {/* Desktop: Two Column Layout */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-6">
        <div className="space-y-6">
          <InfoCard icon={User} title="Personal Information">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  {isEditable ? (
                    <Input
                      id="first_name"
                      value={editedProfile.first_name || ''}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Enter first name"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                      {profile?.first_name || 'Not provided'}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  {isEditable ? (
                    <Input
                      id="last_name"
                      value={editedProfile.last_name || ''}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Enter last name"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                      {profile?.last_name || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                  {profile?.email || 'Not provided'}
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                {isEditable ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                    {profile?.phone || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={User} title="Additional Notes">
            <div>
              <Label htmlFor="notes">Notes</Label>
              {isEditable ? (
                <Textarea
                  id="notes"
                  value={editedProfile.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes..."
                  className="mt-1"
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded min-h-[100px] mt-1">
                  {profile?.notes || 'No notes'}
                </p>
              )}
            </div>
          </InfoCard>
        </div>

        <div className="space-y-6">
          <InfoCard icon={Camera} title="Profile Photo">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} alt="Profile picture" />
                <AvatarFallback className="text-xl">{getInitials(profile)}</AvatarFallback>
              </Avatar>
              {isEditable && (
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              )}
            </div>
          </InfoCard>

          <InfoCard icon={Music2} title="Musical Information">
            <div className="space-y-4">
              <div>
                <Label htmlFor="voice_part">Voice Part</Label>
                {isEditable ? (
                  <Select
                    value={editedProfile.voice_part || ''}
                    onValueChange={(value) => handleInputChange('voice_part', value)}
                  >
                    <SelectTrigger className="mt-1">
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
                  <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                    {voicePartOptions.find(opt => opt.value === profile?.voice_part)?.label || 
                     profile?.voice_part || 'Not assigned'}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="class_year">Class Year</Label>
                {isEditable ? (
                  <Input
                    id="class_year"
                    value={editedProfile.class_year || ''}
                    onChange={(e) => handleInputChange('class_year', e.target.value)}
                    placeholder="Enter class year (e.g., 2025)"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm py-2 px-3 bg-muted rounded mt-1">
                    {profile?.class_year || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </InfoCard>
        </div>
      </div>

      {/* Action Buttons for Edit Mode */}
      {isEditable && onSave && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleCancel} 
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

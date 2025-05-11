
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Music,
  User as UserIcon,
  Save,
  X
} from "lucide-react";
import { Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ProfileOverviewTabProps {
  profile: Profile;
  isEditable?: boolean;
  onSave?: (updatedProfile: any) => Promise<void>;
}

export const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({ 
  profile, 
  isEditable = false,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
    phone: profile.phone || '',
    voice_part: profile.voice_part, // Now required, so no need for || ''
    class_year: profile.class_year || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const formatVoicePart = (voicePart: string | null | undefined) => {
    if (!voicePart) return "Not set";
    
    switch (voicePart) {
      case "soprano_1": return "Soprano 1";
      case "soprano_2": return "Soprano 2";
      case "alto_1": return "Alto 1";
      case "alto_2": return "Alto 2";
      case "tenor": return "Tenor";
      case "bass": return "Bass";
      default: return voicePart;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile values
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone || '',
      voice_part: profile.voice_part,
      class_year: profile.class_year || ''
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Information</CardTitle>
        {isEditable && onSave && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditable ? (
          // Editable form
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input 
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Read Only)</Label>
                <Input 
                  id="email"
                  value={profile.email || ''}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voice_part">Voice Part</Label>
                <Select
                  value={formData.voice_part || undefined}
                  onValueChange={(value) => handleSelectChange('voice_part', value)}
                >
                  <SelectTrigger id="voice_part">
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class_year">Class Year</Label>
                <Input 
                  id="class_year"
                  name="class_year"
                  value={formData.class_year}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Member Status</Label>
              <div className="p-2 bg-muted rounded">
                {profile.status || "Not set"} (Cannot be edited here)
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Join Date</Label>
              <div className="p-2 bg-muted rounded">
                {formatDate(profile.join_date)} (Cannot be edited here)
              </div>
            </div>
          </div>
        ) : (
          // View-only display
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Full Name:</span>
              <span>{profile.first_name} {profile.last_name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Email:</span>
              <span>{profile.email || "Not set"}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Phone:</span>
              <span>{profile.phone || "Not set"}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Voice Part:</span>
              <span>{formatVoicePart(profile.voice_part)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Class Year:</span>
              <span>{profile.class_year || "Not set"}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Join Date:</span>
              <span>{formatDate(profile.join_date)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Status:</span>
              <span>{profile.status}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

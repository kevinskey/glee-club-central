
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Music,
  User as UserIcon,
  School,
  CalendarClock,
  CircleDot,
  FileText,
  BadgeDollarSign,
  Save,
  X
} from "lucide-react";
import { Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { formatPhoneNumber } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";

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
  const { refreshPermissions } = useAuth();
  const [formData, setFormData] = useState({
    personal_title: profile.personal_title || '',
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    phone: profile.phone || '',
    voice_part: profile.voice_part || '', 
    class_year: profile.class_year || '',
    email: profile.email || '',
    status: profile.status || '',
    role: profile.role || '',
    join_date: profile.join_date || '',
    notes: profile.notes || '',
    dues_paid: profile.dues_paid || false
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Update form data when profile or isEditable changes
  useEffect(() => {
    if (profile) {
      setFormData({
        personal_title: profile.personal_title || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        voice_part: profile.voice_part || '',
        class_year: profile.class_year || '',
        email: profile.email || '',
        status: profile.status || '',
        role: profile.role || '',
        join_date: profile.join_date || '',
        notes: profile.notes || '',
        dues_paid: profile.dues_paid || false
      });
    }
  }, [profile, isEditable]);
  
  // Auto sync profile data when component mounts or profile changes
  useEffect(() => {
    if (refreshPermissions) {
      // This will refresh the user's profile data from the database
      refreshPermissions();
    }
  }, [refreshPermissions]);

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
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phone: formattedValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      console.log("Saving profile data:", formData);
      await onSave(formData);
      toast.success("Profile updated successfully");
      
      // Refresh profile data after saving
      if (refreshPermissions) {
        refreshPermissions();
      }
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
      personal_title: profile.personal_title || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone: profile.phone || '',
      voice_part: profile.voice_part || '',
      class_year: profile.class_year || '',
      email: profile.email || '',
      status: profile.status || '',
      role: profile.role || '',
      join_date: profile.join_date || '',
      notes: profile.notes || '',
      dues_paid: profile.dues_paid || false
    });
    
    // If there's a parent component handling edit mode, let it know
    if (onSave) {
      toast.info("Cancelled profile updates");
      onSave(null).catch(err => console.error(err));
    }
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
          // Editable form with all registration data
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personal_title">Title</Label>
                <Select
                  value={formData.personal_title || ''}
                  onValueChange={(value) => handleSelectChange('personal_title', value)}
                >
                  <SelectTrigger id="personal_title">
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
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
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voice_part">Voice Part</Label>
                <Select
                  value={formData.voice_part || ''}
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

              <div className="space-y-2">
                <Label htmlFor="join_date">Join Date</Label>
                <Input 
                  id="join_date"
                  name="join_date"
                  type="date"
                  value={formData.join_date?.toString().slice(0, 10) || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="dues_paid">Dues Paid</Label>
                <Switch 
                  id="dues_paid"
                  checked={formData.dues_paid}
                  onCheckedChange={(checked) => handleSwitchChange('dues_paid', checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Member Status (Read-only)</Label>
              <div className="p-2 bg-muted rounded">
                {formData.status || "Not set"}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Member Role (Read-only)</Label>
              <div className="p-2 bg-muted rounded">
                {formData.role || "Not set"}
              </div>
            </div>
          </div>
        ) : (
          // View-only display with all registration data
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.personal_title && (
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 opacity-70" />
                <span className="font-semibold">Title:</span>
                <span>{profile.personal_title}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Full Name:</span>
              <span>
                {profile.personal_title ? `${profile.personal_title} ` : ''}
                {profile.first_name} {profile.last_name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Email:</span>
              <span>{profile.email || "Not set"}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Phone:</span>
              <span>{formatPhoneNumber(profile.phone) || "Not set"}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Voice Part:</span>
              <span>{formatVoicePart(profile.voice_part)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <School className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Class Year:</span>
              <span>{profile.class_year || "Not set"}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Join Date:</span>
              <span>{formatDate(profile.join_date)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <CircleDot className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Status:</span>
              <span>{profile.status}</span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Role:</span>
              <span>{profile.role}</span>
            </div>
            
            {profile.title && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 opacity-70" />
                <span className="font-semibold">Title:</span>
                <span>{profile.title}</span>
              </div>
            )}
            
            {profile.special_roles && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 opacity-70" />
                <span className="font-semibold">Special Roles:</span>
                <span>{profile.special_roles}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <CalendarClock className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Created At:</span>
              <span>{formatDate(profile.created_at)}</span>
            </div>
            
            {profile.updated_at && (
              <div className="flex items-center space-x-2">
                <CalendarClock className="h-4 w-4 opacity-70" />
                <span className="font-semibold">Last Updated:</span>
                <span>{formatDate(profile.updated_at)}</span>
              </div>
            )}
            
            {profile.last_sign_in_at && (
              <div className="flex items-center space-x-2">
                <CalendarClock className="h-4 w-4 opacity-70" />
                <span className="font-semibold">Last Sign In:</span>
                <span>{formatDate(profile.last_sign_in_at)}</span>
              </div>
            )}
            
            {profile.notes && (
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 opacity-70" />
                <span className="font-semibold">Notes:</span>
                <span>{profile.notes}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <BadgeDollarSign className="h-4 w-4 opacity-70" />
              <span className="font-semibold">Dues Paid:</span>
              <span>{profile.dues_paid ? "Yes" : "No"}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

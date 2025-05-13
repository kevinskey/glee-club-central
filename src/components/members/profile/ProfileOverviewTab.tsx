import React, { useState } from "react";
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
  
  // Auto sync profile data when component mounts or profile changes
  React.useEffect(() => {
    if (refreshPermissions) {
      // This will refresh the user's profile data from the database
      refreshPermissions();
    }
  }, [refreshPermissions]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const formatVoicePart = (voicePart: string) => {
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

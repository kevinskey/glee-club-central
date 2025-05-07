
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Music, // Added Music import
  User as UserIcon 
} from "lucide-react";

interface Profile {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role: string;
  voice_part?: string | null;
  status: string;
  join_date?: string | null;
  year_in_school?: string | null;
  preferred_name?: string | null;
}

interface ProfileOverviewTabProps {
  profile: Profile;
}

export const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({ profile }) => {
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
      case "tenor_1": return "Tenor 1";
      case "tenor_2": return "Tenor 2";
      case "bass_1": return "Bass 1";
      case "bass_2": return "Bass 2";
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
            <User className="h-4 w-4 opacity-70" />
            <span className="font-semibold">Preferred Name:</span>
            <span>{profile.preferred_name || "Not set"}</span>
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
            <span className="font-semibold">Year in School:</span>
            <span>{profile.year_in_school || "Not set"}</span>
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
      </CardContent>
    </Card>
  );
};

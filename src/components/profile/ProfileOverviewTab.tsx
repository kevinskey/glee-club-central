
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { User } from "@/hooks/useUserManagement";

interface ProfileOverviewTabProps {
  profile: User;
  isEditable?: boolean; // Added isEditable prop
}

export function ProfileOverviewTab({ profile, isEditable }: ProfileOverviewTabProps) {
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Member details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
              <p>{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h3>
              <p>{profile.email || "Not set"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone Number</h3>
              <p>{profile.phone || "Not set"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Voice Part</h3>
              <p>{formatVoicePart(profile.voice_part)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
              <p>{profile.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h3>
              <p>{profile.join_date ? formatDate(profile.join_date) : "Not set"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>
            Current status and activity information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Role</h3>
              <p>{profile.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Joined</h3>
              <p>{profile.created_at ? formatDate(profile.created_at) : "Unknown"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Login</h3>
              <p>{profile.last_sign_in_at ? formatDate(profile.last_sign_in_at) : "Never"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

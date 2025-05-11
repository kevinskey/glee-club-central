
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProfileOverviewTabProps {
  profile: Profile;
  isEditable?: boolean;
  onSave?: (updatedProfile: Partial<Profile>) => Promise<void>;
}

export function ProfileOverviewTab({ profile, isEditable = false, onSave }: ProfileOverviewTabProps) {
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({
    first_name: profile.first_name,
    last_name: profile.last_name,
    phone: profile.phone,
    voice_part: profile.voice_part,
    class_year: profile.class_year,
  });

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

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(editedProfile);
    }
  };

  // Render in view-only mode
  if (!isEditable) {
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

  // Render in edit mode
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Edit your member details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input 
                id="first_name"
                value={editedProfile.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input 
                id="last_name"
                value={editedProfile.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Read Only)</Label>
              <Input 
                id="email"
                value={profile.email || ''}
                readOnly
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                value={editedProfile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voice_part">Voice Part</Label>
              <Select 
                value={editedProfile.voice_part || ''}
                onValueChange={(value) => handleInputChange('voice_part', value)}
              >
                <SelectTrigger id="voice_part">
                  <SelectValue placeholder="Select your voice part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soprano_1">Soprano 1</SelectItem>
                  <SelectItem value="soprano_2">Soprano 2</SelectItem>
                  <SelectItem value="alto_1">Alto 1</SelectItem>
                  <SelectItem value="alto_2">Alto 2</SelectItem>
                  <SelectItem value="tenor_1">Tenor 1</SelectItem>
                  <SelectItem value="tenor_2">Tenor 2</SelectItem>
                  <SelectItem value="bass_1">Bass 1</SelectItem>
                  <SelectItem value="bass_2">Bass 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_year">Class Year</Label>
              <Input 
                id="class_year"
                value={editedProfile.class_year || ''}
                onChange={(e) => handleInputChange('class_year', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>
            Current status and activity information (Read Only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Role</h3>
              <p>{profile.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
              <p>{profile.status}</p>
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

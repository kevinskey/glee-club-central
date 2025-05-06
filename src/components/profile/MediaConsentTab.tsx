
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { User } from "@/hooks/useUserManagement";
import { Camera, Tag, X } from "lucide-react";

interface MediaConsentTabProps {
  profile: User;
}

// This would normally come from the database
interface MediaConsent {
  photoConsent: boolean;
  videoConsent: boolean;
  socialMediaConsent: boolean;
  tags: string[];
}

export function MediaConsentTab({ profile }: MediaConsentTabProps) {
  // Mock media consent info - in a real app, this would come from the database
  const mediaConsent: MediaConsent = {
    photoConsent: true,
    videoConsent: true,
    socialMediaConsent: false,
    tags: ["Alumni Concert 2025", "Spring Tour", "Holiday Concert"]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Consent</CardTitle>
          <CardDescription>
            Your preferences for media usage and distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Photo Consent</Label>
                <p className="text-sm text-muted-foreground">
                  Allow use of your photographs in Glee Club materials
                </p>
              </div>
              <Switch checked={mediaConsent.photoConsent} disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Video Consent</Label>
                <p className="text-sm text-muted-foreground">
                  Allow use of your video recordings in Glee Club materials
                </p>
              </div>
              <Switch checked={mediaConsent.videoConsent} disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Social Media Consent</Label>
                <p className="text-sm text-muted-foreground">
                  Allow tagging and identification on social media platforms
                </p>
              </div>
              <Switch checked={mediaConsent.socialMediaConsent} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Media Tags</CardTitle>
          <CardDescription>
            Performances you have been tagged in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mediaConsent.tags.length > 0 ? (
              mediaConsent.tags.map((tag, index) => (
                <Badge key={index} className="flex items-center gap-1 px-3 py-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))
            ) : (
              <div className="flex items-center text-muted-foreground">
                <Camera className="h-4 w-4 mr-2" />
                No media tags found
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 border rounded-md bg-muted/50">
            <p className="text-sm">
              <span className="font-medium">Note:</span> Media consent settings can only be changed by an administrator. 
              Please contact the Glee Club director if you need to update your preferences.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, X, Image, Camera, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Profile {
  id: string;
  photo_consent?: boolean | null;
  video_consent?: boolean | null;
  social_media_consent?: boolean | null;
  // Other profile properties
}

interface MediaConsentTabProps {
  profile: Profile;
}

export const MediaConsentTab: React.FC<MediaConsentTabProps> = ({ profile }) => {
  // For demo purposes, adding mock data since it might not be in the profile yet
  const [photoConsent, setPhotoConsent] = useState(profile.photo_consent !== undefined ? profile.photo_consent : true);
  const [videoConsent, setVideoConsent] = useState(profile.video_consent !== undefined ? profile.video_consent : true);
  const [socialMediaConsent, setSocialMediaConsent] = useState(profile.social_media_consent !== undefined ? profile.social_media_consent : false);
  
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(["Spring Concert 2025", "Alumni Weekend"]);

  const addTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Mock media appearances
  const mediaAppearances = [
    { id: 1, type: "Photo", event: "Spring Concert 2025", date: "2025-04-15", url: "/media/spring-concert-1.jpg" },
    { id: 2, type: "Video", event: "Community Outreach", date: "2025-03-20", url: "/media/outreach-video.mp4" },
    { id: 3, type: "Photo", event: "Alumni Weekend", date: "2025-02-10", url: "/media/alumni-weekend.jpg" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Consent Settings</CardTitle>
          <CardDescription>Manage your consent for media usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Photography Consent</h4>
              <p className="text-sm text-muted-foreground">
                Allow the use of photographs in Glee Club materials
              </p>
            </div>
            <Switch 
              checked={photoConsent as boolean} 
              onCheckedChange={setPhotoConsent}
              aria-label="Toggle photo consent"
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Video Recording Consent</h4>
              <p className="text-sm text-muted-foreground">
                Allow the use of video recordings in Glee Club materials
              </p>
            </div>
            <Switch 
              checked={videoConsent as boolean} 
              onCheckedChange={setVideoConsent}
              aria-label="Toggle video consent"
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Social Media Usage</h4>
              <p className="text-sm text-muted-foreground">
                Allow content to be shared on Glee Club social media accounts
              </p>
            </div>
            <Switch 
              checked={socialMediaConsent as boolean} 
              onCheckedChange={setSocialMediaConsent}
              aria-label="Toggle social media consent"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Media Tags</CardTitle>
          <CardDescription>Tag performances you've participated in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add performance tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={addTag}>Add</Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((t) => (
              <Badge key={t} className="px-3 py-1 flex items-center gap-1">
                {t}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => removeTag(t)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Appearances</CardTitle>
          <CardDescription>Your appearances in Glee Club media</CardDescription>
        </CardHeader>
        <CardContent>
          {mediaAppearances.length > 0 ? (
            <div className="space-y-4">
              {mediaAppearances.map((appearance) => (
                <div key={appearance.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center space-x-3">
                    {appearance.type === "Photo" ? (
                      <Image className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Video className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <h4 className="font-medium">{appearance.event}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appearance.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View {appearance.type}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No media appearances found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

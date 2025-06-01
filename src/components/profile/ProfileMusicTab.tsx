
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Download, Play, BookOpen } from "lucide-react";

interface ProfileMusicTabProps {
  profile: any;
}

export const ProfileMusicTab: React.FC<ProfileMusicTabProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            My Sheet Music
          </CardTitle>
          <CardDescription>
            Access your assigned sheet music and practice tracks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Amazing Grace</p>
                <p className="text-sm text-muted-foreground">Traditional Spiritual</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  Listen
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Lift Every Voice and Sing</p>
                <p className="text-sm text-muted-foreground">James Weldon Johnson</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  Listen
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Practice Resources
          </CardTitle>
          <CardDescription>
            Tools and resources to help you practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Music className="h-6 w-6" />
              <span>Vocal Warm-ups</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Play className="h-6 w-6" />
              <span>Practice Tracks</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice Part Information</CardTitle>
          <CardDescription>
            Details about your voice part and section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="font-medium">Voice Part</p>
              <p className="text-sm text-muted-foreground">{profile?.voice_part || 'Not assigned'}</p>
            </div>
            <div>
              <p className="font-medium">Section Leader</p>
              <p className="text-sm text-muted-foreground">Sarah Johnson</p>
            </div>
            <div>
              <p className="font-medium">Practice Schedule</p>
              <p className="text-sm text-muted-foreground">Tuesdays & Thursdays, 6:00 PM - 8:00 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

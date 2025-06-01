
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

interface ProfileParticipationTabProps {
  profile: any;
}

export const ProfileParticipationTab: React.FC<ProfileParticipationTabProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Summary
          </CardTitle>
          <CardDescription>
            Your rehearsal and event attendance record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-muted-foreground">Rehearsal Attendance</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-muted-foreground">Concert Attendance</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-muted-foreground">Events This Semester</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your recent participation in Glee Club activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Spring Concert Rehearsal</p>
                <p className="text-sm text-muted-foreground">March 15, 2024</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">Present</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Sectional Practice - Alto</p>
                <p className="text-sm text-muted-foreground">March 12, 2024</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">Present</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Weekly Rehearsal</p>
                <p className="text-sm text-muted-foreground">March 10, 2024</p>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Excused</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Roles & Responsibilities
          </CardTitle>
          <CardDescription>
            Your current roles within the Glee Club
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge>{profile?.voice_part || 'Not assigned'}</Badge>
              <span className="text-sm text-muted-foreground">Voice Part</span>
            </div>
            {profile?.role && profile.role !== 'member' && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{profile.role}</Badge>
                <span className="text-sm text-muted-foreground">Special Role</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

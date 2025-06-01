
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileSidebarProps {
  profile: any;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Information</CardTitle>
        <CardDescription>
          Your membership details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          As a member of the Spelman College Glee Club, you have access to resources, 
          sheet music, and other materials.
        </p>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Membership Status:</h4>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${profile?.status === "active" ? "bg-green-500" : "bg-yellow-500"}`}></span>
            <span className="capitalize">{profile?.status || "Active"}</span>
          </div>
        </div>
        {profile?.role && (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium">Role:</h4>
            <span className="capitalize text-sm">{profile.role.replace('_', ' ')}</span>
          </div>
        )}
        {profile?.voice_part && (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium">Voice Part:</h4>
            <span className="text-sm">{profile.voice_part}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

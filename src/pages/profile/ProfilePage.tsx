
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import { ProfileOverviewTab } from "@/components/profile/ProfileOverviewTab";
import { ParticipationTab } from "@/components/profile/ParticipationTab";
import { MusicAccessTab } from "@/components/profile/MusicAccessTab";
import { WardrobeTab } from "@/components/profile/WardrobeTab";
import { FinancialInfoTab } from "@/components/profile/FinancialInfoTab";
import { MediaConsentTab } from "@/components/profile/MediaConsentTab";
import { UserRoleEditor } from "@/components/profile/UserRoleEditor";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { profile, isLoading } = useAuth();
  const { hasPermission } = usePermissions();
  const canManageRoles = hasPermission('can_manage_users');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">
            We couldn't find your profile information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your Glee Club membership information"
        icon={<User className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="wardrobe">Wardrobe</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <ProfileOverviewTab profile={profile} isEditable />
            </TabsContent>
            
            <TabsContent value="participation">
              <ParticipationTab memberId={profile.id} />
            </TabsContent>
            
            <TabsContent value="music">
              <MusicAccessTab memberId={profile.id} voicePart={profile.voice_part} />
            </TabsContent>
            
            <TabsContent value="wardrobe">
              <WardrobeTab profile={profile} />
            </TabsContent>
            
            <TabsContent value="financial">
              <FinancialInfoTab memberId={profile.id} />
            </TabsContent>
            
            <TabsContent value="media">
              <MediaConsentTab profile={profile} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <UserRoleEditor />
          
          {canManageRoles && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Access</CardTitle>
                <CardDescription>
                  Special administrative features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  As an administrator, you have special privileges to manage user permissions, 
                  roles and other administrative functions.
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Administrative Tools:</h4>
                  <ul className="text-sm space-y-1 list-disc pl-4">
                    <li>Manage user permissions</li>
                    <li>Edit member roles</li>
                    <li>Handle financial records</li>
                    <li>Configure system settings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

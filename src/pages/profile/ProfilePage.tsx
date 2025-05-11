
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { User, Edit, Save } from "lucide-react";
import { ProfileOverviewTab } from "@/components/members/profile/ProfileOverviewTab";
import { ParticipationTab } from "@/components/profile/ParticipationTab";
import { MusicAccessTab } from "@/components/profile/MusicAccessTab";
import { WardrobeTab } from "@/components/profile/WardrobeTab";
import { FinancialInfoTab } from "@/components/profile/FinancialInfoTab";
import { MediaConsentTab } from "@/components/profile/MediaConsentTab";
import { UserRoleEditor } from "@/components/profile/UserRoleEditor";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Spinner } from "@/components/ui/spinner";

export default function ProfilePage() {
  const { profile, isLoading, refreshPermissions } = useAuth();
  const { hasPermission } = usePermissions();
  const { updateUser } = useUserManagement();
  const canManageRoles = hasPermission('can_manage_users');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Auto sync profile data at regular intervals
  useEffect(() => {
    if (!refreshPermissions) return;
    
    // Refresh immediately on mount
    refreshPermissions();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      refreshPermissions();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [refreshPermissions]);
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  const handleProfileUpdate = async (updatedProfile: any) => {
    if (!profile?.id) return;
    
    try {
      const success = await updateUser(profile.id, updatedProfile);
      if (success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        // Refresh the user's profile and permissions
        if (refreshPermissions) {
          refreshPermissions();
        }
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isEditing && tab !== "overview") {
      setIsEditing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title="My Profile"
          description="View and manage your Glee Club membership information"
          icon={<User className="h-6 w-6" />}
        />
        {activeTab === "overview" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleEditMode}
            className="flex items-center gap-1"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>Exit Edit Mode</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="wardrobe">Wardrobe</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <ProfileOverviewTab 
                profile={profile} 
                isEditable={isEditing} 
                onSave={handleProfileUpdate}
              />
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

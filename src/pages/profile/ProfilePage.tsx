
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { User, Edit, Save } from "lucide-react";
import { ProfileOverviewTab } from "@/components/profile/ProfileOverviewTab";
import { ProfileParticipationTab } from "@/components/profile/ProfileParticipationTab";
import { ProfileMusicTab } from "@/components/profile/ProfileMusicTab";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageLoader } from "@/components/ui/page-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserUpdate } from "@/hooks/user/useUserUpdate";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { updateUser } = useUserUpdate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  const handleProfileUpdate = async (updatedProfile: any) => {
    if (!profile?.id) {
      toast.error("No profile ID available");
      return;
    }
    
    if (updatedProfile === null) {
      setIsEditing(false);
      return;
    }
    
    try {
      const success = await updateUser(profile.id, updatedProfile);
      if (success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
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
  
  if (authLoading || profileLoading) {
    return <PageLoader message="Loading profile..." />;
  }
  
  if (!user || !profile) {
    return (
      <div className="container mx-auto p-4">
        <Alert className="mb-6">
          <AlertDescription>
            Profile information is not available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
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
            <TabsList className="mb-4 grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <ProfileOverviewTab 
                profile={{
                  ...profile,
                  email: user.email
                }}
                isEditable={isEditing} 
                onSave={handleProfileUpdate}
              />
            </TabsContent>
            
            <TabsContent value="participation">
              <ProfileParticipationTab profile={profile} />
            </TabsContent>
            
            <TabsContent value="music">
              <ProfileMusicTab profile={profile} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <ProfileSidebar profile={profile} />
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { User, Edit, Save, AlertCircle } from "lucide-react";
import { ProfileOverviewTab } from "@/components/members/profile/ProfileOverviewTab";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    
    // If updatedProfile is null, it means the user cancelled the edit
    if (updatedProfile === null) {
      setIsEditing(false);
      return;
    }
    
    try {
      console.log("Updating profile with data:", updatedProfile);
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
  
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Profile information is not available. This may be because your account is still being set up.
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
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Participation tracking coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="music">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Music access information coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
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
                  <span className={`w-2 h-2 rounded-full ${profile.status === "active" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                  <span className="capitalize">{profile.status || "Active"}</span>
                </div>
              </div>
              {profile.role && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Role:</h4>
                  <span className="capitalize text-sm">{profile.role.replace('_', ' ')}</span>
                </div>
              )}
              {profile.voice_part && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Voice Part:</h4>
                  <span className="text-sm">{profile.voice_part}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

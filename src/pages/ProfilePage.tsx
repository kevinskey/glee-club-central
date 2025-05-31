
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { User, Edit, Save } from "lucide-react";
import { ProfileOverviewTab } from "@/components/members/profile/ProfileOverviewTab";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserManagement } from "@/hooks/user/useUserManagement";
import { PageLoader } from "@/components/ui/page-loader";

export default function ProfilePage() {
  const { profile, isLoading } = useAuth();
  const { updateUser } = useUserManagement();
  const [isEditing, setIsEditing] = useState(false);
  
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
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    }
  };
  
  if (isLoading) {
    return <PageLoader message="Loading profile..." />;
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
      <div className="flex justify-between items-start">
        <PageHeader
          title="My Profile"
          description="View and manage your Glee Club membership information"
          icon={<User className="h-6 w-6" />}
        />
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileOverviewTab 
            profile={profile} 
            isEditable={isEditing} 
            onSave={handleProfileUpdate}
          />
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
                  <span className="capitalize">{profile.status || "Pending"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

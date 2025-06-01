
import React, { useState } from 'react';
import { useSimpleAuthContextFixed } from "@/contexts/SimpleAuthContextFixed";
import { toast } from "sonner";
import { PageLoader } from "@/components/ui/page-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserUpdate } from "@/hooks/user/useUserUpdate";
import { EnhancedProfileHeader } from "@/components/profile/EnhancedProfileHeader";
import { MobileProfileTabs } from "@/components/profile/MobileProfileTabs";
import { EnhancedProfileOverview } from "@/components/profile/EnhancedProfileOverview";
import { ProfileParticipationTab } from "@/components/profile/ProfileParticipationTab";
import { ProfileMusicTab } from "@/components/profile/ProfileMusicTab";

export default function ProfilePageFixed() {
  const { user, profile, isLoading, isInitialized } = useSimpleAuthContextFixed();
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Glee Club Profile',
        text: `Check out ${profile?.first_name}'s profile in the Spelman Glee Club`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard");
    }
  };

  const handleSettings = () => {
    toast.info("Settings feature coming soon");
  };
  
  // Show loading during initialization
  if (!isInitialized || isLoading) {
    return <PageLoader message="Loading profile..." />;
  }
  
  // Show error if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Alert className="mb-6">
          <AlertDescription>
            Please log in to view your profile. <a href="/login" className="underline">Go to login</a>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading if profile is still being fetched
  if (!profile) {
    return <PageLoader message="Loading profile data..." />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <EnhancedProfileOverview
            profile={{
              ...profile,
              email: user.email
            }}
            isEditable={isEditing}
            onSave={handleProfileUpdate}
          />
        );
      case "participation":
        return <ProfileParticipationTab profile={profile} />;
      case "music":
        return <ProfileMusicTab profile={profile} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <EnhancedProfileHeader
          profile={profile}
          user={user}
          isEditing={isEditing}
          onToggleEdit={toggleEditMode}
          onShare={handleShare}
          onSettings={handleSettings}
        />
        
        <MobileProfileTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          {renderTabContent()}
        </MobileProfileTabs>
      </div>
    </div>
  );
}

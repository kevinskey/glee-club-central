
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { 
  User, 
  Calendar, 
  Music, 
  Shirt, 
  Wallet, 
  Camera, 
  FileText,
  Edit,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ProfileOverviewTab } from "@/components/profile/ProfileOverviewTab";
import { ParticipationTab } from "@/components/profile/ParticipationTab";
import { MusicAccessTab } from "@/components/profile/MusicAccessTab";
import { WardrobeTab } from "@/components/profile/WardrobeTab";
import { FinancialInfoTab } from "@/components/profile/FinancialInfoTab";
import { MediaConsentTab } from "@/components/profile/MediaConsentTab";
import { AdminNotesTab } from "@/components/profile/AdminNotesTab";
import { getStatusBadge, getRoleBadge } from "@/components/members/UserBadges";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchUserById, UserSafe } from "@/utils/supabase/users";

export default function MemberProfilePage() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Determine if we're viewing our own profile or someone else's
  const isViewingSelf = !id || id === user?.id;
  const userId = id || user?.id;
  
  const { data: memberProfile, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserById(userId as string),
    enabled: !!userId,
  });
  
  // For admin view of other profiles
  const canEdit = isAdmin() || isViewingSelf;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
        <p className="ml-2">Loading profile...</p>
      </div>
    );
  }

  // Transform profile (if needed) to ensure it conforms to UserSafe type
  const ensureUserSafe = (maybeUser: any): UserSafe => {
    if (!maybeUser) return null as unknown as UserSafe;
    
    // Ensure all required fields are present
    return {
      ...maybeUser,
      role_display_name: maybeUser.role_display_name || formatRoleDisplayName(maybeUser.role),
      voice_part_display: maybeUser.voice_part_display || formatVoicePartDisplay(maybeUser.voice_part),
      updated_at: maybeUser.updated_at || maybeUser.created_at || new Date().toISOString(),
    } as UserSafe;
  };
  
  // Format role display name if not provided
  const formatRoleDisplayName = (role: string): string => {
    if (!role) return "Unknown";
    
    switch (role) {
      case "administrator": return "Administrator";
      case "section_leader": return "Section Leader";
      case "singer": return "Singer";
      case "student_conductor": return "Student Conductor";
      case "accompanist": return "Accompanist";
      case "non_singer": return "Non-Singer";
      default: return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
    }
  };
  
  // Format voice part if not provided
  const formatVoicePartDisplay = (voicePart: string | null): string => {
    if (!voicePart) return "Not set";
    
    switch (voicePart) {
      case "soprano_1": return "Soprano 1";
      case "soprano_2": return "Soprano 2";
      case "alto_1": return "Alto 1";
      case "alto_2": return "Alto 2";
      case "tenor": return "Tenor";
      case "bass": return "Bass";
      default: return voicePart;
    }
  };

  // Get final display profile, ensuring it meets UserSafe requirements
  const displayProfile = isViewingSelf ? ensureUserSafe(profile) : ensureUserSafe(memberProfile);
  
  if (!displayProfile) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Profile not found</h2>
        <p className="mb-4">The requested profile could not be found or you don't have permission to view it.</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const formatVoicePart = (voicePart: string | null | undefined) => {
    if (!voicePart) return "Not set";
    
    switch (voicePart) {
      case "soprano_1": return "Soprano 1";
      case "soprano_2": return "Soprano 2";
      case "alto_1": return "Alto 1";
      case "alto_2": return "Alto 2";
      case "tenor_1": return "Tenor 1";
      case "tenor_2": return "Tenor 2";
      case "bass_1": return "Bass 1";
      case "bass_2": return "Bass 2";
      default: return voicePart;
    }
  };

  const formatClassYear = (classYear: string | null | undefined) => {
    return classYear || "Not set";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {canEdit && (
          <Button onClick={() => navigate(`/dashboard/profile/edit/${userId}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
      
      <PageHeader
        title={`${displayProfile.first_name || ''} ${displayProfile.last_name || ''}`}
        description={`${formatVoicePart(displayProfile.voice_part)} - Member since ${displayProfile.join_date ? new Date(displayProfile.join_date).toLocaleDateString() : 'N/A'}`}
        icon={<User className="h-6 w-6" />}
      />

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Card className="p-6 flex flex-col items-center md:w-1/4">
          <Avatar className="h-32 w-32 mb-4">
            {displayProfile.avatar_url ? (
              <AvatarImage src={displayProfile.avatar_url} alt={`${displayProfile.first_name} ${displayProfile.last_name}`} />
            ) : (
              <AvatarFallback>
                {displayProfile.first_name?.[0]}{displayProfile.last_name?.[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-xl font-bold mb-1">{`${displayProfile.first_name || ''} ${displayProfile.last_name || ''}`}</h2>
          <p className="text-muted-foreground mb-3">{formatVoicePart(displayProfile.voice_part)}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {getRoleBadge(displayProfile.role)}
            {getStatusBadge(displayProfile.status || 'pending')}
          </div>
        </Card>

        <div className="md:w-3/4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-7 lg:w-fit">
              <TabsTrigger value="overview"><User className="h-4 w-4 mr-2" />Overview</TabsTrigger>
              <TabsTrigger value="participation"><Calendar className="h-4 w-4 mr-2" />Participation</TabsTrigger>
              <TabsTrigger value="music"><Music className="h-4 w-4 mr-2" />Music</TabsTrigger>
              <TabsTrigger value="wardrobe"><Shirt className="h-4 w-4 mr-2" />Wardrobe</TabsTrigger>
              <TabsTrigger value="financial"><Wallet className="h-4 w-4 mr-2" />Financial</TabsTrigger>
              <TabsTrigger value="media"><Camera className="h-4 w-4 mr-2" />Media</TabsTrigger>
              {isAdmin() && (
                <TabsTrigger value="admin"><FileText className="h-4 w-4 mr-2" />Admin Notes</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Member Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{displayProfile.email || "Not set"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{displayProfile.phone || "Not set"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Voice Part</p>
                    <p>{formatVoicePart(displayProfile.voice_part)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Class Year</p>
                    <p>{formatClassYear(displayProfile.class_year)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p>{displayProfile.join_date ? new Date(displayProfile.join_date).toLocaleDateString() : "Not set"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Dues Paid</p>
                    <p>{displayProfile.dues_paid ? "Yes" : "No"}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Last Sign In</p>
                    <p>{displayProfile.last_sign_in_at ? new Date(displayProfile.last_sign_in_at).toLocaleString() : "Never"}</p>
                  </div>
                </div>
                
                {isAdmin() && (
                  <>
                    <h3 className="text-lg font-medium mt-6 mb-4">Administrative Information</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Special Roles</p>
                        <p>{displayProfile.special_roles || "None"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="whitespace-pre-wrap">{displayProfile.notes || "No notes"}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="participation">
              <ParticipationTab memberId={displayProfile.id} />
            </TabsContent>
            
            <TabsContent value="music">
              <MusicAccessTab memberId={displayProfile.id} voicePart={displayProfile.voice_part} />
            </TabsContent>
            
            <TabsContent value="wardrobe">
              <WardrobeTab profile={displayProfile} />
            </TabsContent>
            
            <TabsContent value="financial">
              <FinancialInfoTab memberId={displayProfile.id} />
            </TabsContent>
            
            <TabsContent value="media">
              <MediaConsentTab profile={displayProfile} />
            </TabsContent>
            
            {isAdmin() && (
              <TabsContent value="admin">
                <AdminNotesTab memberId={displayProfile.id} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

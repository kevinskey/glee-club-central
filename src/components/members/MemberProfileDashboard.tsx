
import React from "react";
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
import { 
  User, 
  Calendar, 
  Music, 
  Shirt, 
  Wallet, 
  Camera, 
  FileText,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserById, UserSafe } from "@/utils/supabase/users";
import { ProfileOverviewTab } from "@/components/members/profile/ProfileOverviewTab";
import { ParticipationTab } from "@/components/members/profile/ParticipationTab";
import { MusicAccessTab } from "@/components/members/profile/MusicAccessTab";
import { WardrobeTab } from "@/components/members/profile/WardrobeTab";
import { FinancialInfoTab } from "@/components/members/profile/FinancialInfoTab";
import { MediaConsentTab } from "@/components/members/profile/MediaConsentTab";
import { AdminNotesTab } from "@/components/members/profile/AdminNotesTab";

interface MemberProfileDashboardProps {
  memberId: string;
}

export const MemberProfileDashboard: React.FC<MemberProfileDashboardProps> = ({ memberId }) => {
  const { isAdmin } = useAuth();
  
  const { data: memberProfile, isLoading } = useQuery({
    queryKey: ['userProfile', memberId],
    queryFn: () => fetchUserById(memberId),
    enabled: !!memberId,
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
        <p className="ml-2">Loading profile...</p>
      </div>
    );
  }

  if (!memberProfile) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Profile not found</h2>
        <p className="mb-4">The requested profile could not be found or you don't have permission to view it.</p>
      </div>
    );
  }

  // We can now use voice_part_display directly from the database
  const formatVoicePart = (voicePart: string | null | undefined) => {
    if (!voicePart) return "Not set";
    return memberProfile.voice_part_display || voicePart;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
      case "administrator":
        return <Badge className="bg-red-500">Admin</Badge>;
      case "section_leader":
        return <Badge className="bg-amber-500">Section Leader</Badge>;
      case "member":
      case "singer":
        return <Badge className="bg-green-500">Member</Badge>;
      case "Director":
      case "director":
        return <Badge className="bg-purple-500">Director</Badge>;
      case "Accompanist":
      case "accompanist":
        return <Badge className="bg-blue-500">Accompanist</Badge>;
      default:
        return <Badge className="bg-slate-500">{memberProfile.role_display_name || role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "alumni":
        return <Badge className="bg-blue-500">Alumni</Badge>;
      case "on_leave":
        return <Badge className="bg-orange-500">On Leave</Badge>;
      case "deleted":
        return <Badge className="bg-red-500">Deleted</Badge>;
      default:
        return <Badge className="bg-slate-500">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="p-6 flex flex-col items-center md:w-1/4">
        <Avatar className="h-32 w-32 mb-4">
          {memberProfile.avatar_url ? (
            <AvatarImage src={memberProfile.avatar_url} alt={`${memberProfile.first_name} ${memberProfile.last_name}`} />
          ) : (
            <AvatarFallback>
              {memberProfile.first_name?.[0]}{memberProfile.last_name?.[0]}
            </AvatarFallback>
          )}
        </Avatar>
        <h2 className="text-xl font-bold mb-1">{`${memberProfile.first_name || ''} ${memberProfile.last_name || ''}`}</h2>
        <p className="text-muted-foreground mb-3">{formatVoicePart(memberProfile.voice_part)}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {getRoleBadge(memberProfile.role)}
          {getStatusBadge(memberProfile.status)}
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
            <ProfileOverviewTab profile={memberProfile} />
          </TabsContent>
          
          <TabsContent value="participation">
            <ParticipationTab memberId={memberProfile.id} />
          </TabsContent>
          
          <TabsContent value="music">
            <MusicAccessTab memberId={memberProfile.id} voicePart={memberProfile.voice_part} />
          </TabsContent>
          
          <TabsContent value="wardrobe">
            <WardrobeTab profile={memberProfile as any} />
          </TabsContent>
          
          <TabsContent value="financial">
            <FinancialInfoTab memberId={memberProfile.id} />
          </TabsContent>
          
          <TabsContent value="media">
            <MediaConsentTab profile={memberProfile as any} />
          </TabsContent>
          
          {isAdmin() && (
            <TabsContent value="admin">
              <AdminNotesTab memberId={memberProfile.id} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

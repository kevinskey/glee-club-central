
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { 
  User, 
  CalendarDays, 
  Music, 
  SquareUser,
  Banknote,
  ArrowLeft,
  Edit,
  Trash2
} from "lucide-react";
import { getStatusBadge, getRoleBadge } from "@/components/members/UserBadges";
import { fetchUserById } from "@/utils/supabaseQueries";
import { DeleteUserDialog } from "@/components/members/DeleteUserDialog";
import { useUserDelete } from "@/hooks/user-management/useUserDelete";

export default function MemberProfilePage() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Determine if we're viewing our own profile or someone else's
  const isViewingSelf = !id || id === user?.id;
  const userId = id || user?.id;
  
  const { data: memberProfile, isLoading, refetch } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserById(userId as string),
    enabled: !!userId,
  });

  // For admin view of other profiles
  const canEdit = isAdmin() || isViewingSelf;
  const canDelete = isAdmin() && !isViewingSelf;

  // Set up user deletion
  const { userToDelete, isSubmitting, handleDeleteUser, openDeleteUserDialog } = useUserDelete(() => {
    toast.success("Member deleted successfully");
    navigate('/dashboard/members');
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
        <p className="ml-2">Loading profile...</p>
      </div>
    );
  }

  const displayProfile = isViewingSelf ? profile : memberProfile;
  
  if (!displayProfile) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Profile not found</h2>
        <p className="mb-4">The requested profile could not be found or you don't have permission to view it.</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }
  
  const handleDeleteClick = () => {
    if (memberProfile) {
      openDeleteUserDialog(memberProfile);
      setIsDeleteDialogOpen(true);
    }
  };

  const formatVoicePart = (voicePart: string | null | undefined) => {
    if (!voicePart) return "Not specified";
    
    const voicePartMap: Record<string, string> = {
      "soprano_1": "Soprano 1",
      "soprano_2": "Soprano 2",
      "alto_1": "Alto 1",
      "alto_2": "Alto 2",
      "tenor": "Tenor",
      "bass": "Bass"
    };
    
    return voicePartMap[voicePart] || voicePart;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex gap-2">
          {canEdit && (
            <Button 
              onClick={() => navigate(`/dashboard/members/edit/${userId}`)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
          
          {canDelete && (
            <Button 
              variant="destructive"
              onClick={handleDeleteClick}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Member
            </Button>
          )}
        </div>
      </div>
      
      <PageHeader
        title={`${displayProfile.first_name || ''} ${displayProfile.last_name || ''}`}
        description={`${formatVoicePart(displayProfile.voice_part)} - Member since ${formatDate(displayProfile.join_date)}`}
        icon={<User className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card className="p-6 flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              {displayProfile.avatar_url ? (
                <AvatarImage src={displayProfile.avatar_url} alt={`${displayProfile.first_name} ${displayProfile.last_name}`} />
              ) : (
                <AvatarFallback className="text-xl">
                  {displayProfile.first_name?.[0]}{displayProfile.last_name?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <h2 className="text-xl font-bold mb-1 text-center">{`${displayProfile.first_name || ''} ${displayProfile.last_name || ''}`}</h2>
            <p className="text-muted-foreground mb-3">{formatVoicePart(displayProfile.voice_part)}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {getRoleBadge(displayProfile.role)}
              {getStatusBadge(displayProfile.status)}
            </div>
            
            {/* Quick Info */}
            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Member ID:</span>
                <span className="ml-auto font-medium truncate max-w-[120px]" title={displayProfile.id}>
                  {displayProfile.id?.substring(0, 8)}...
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span className="ml-auto font-medium">{formatDate(displayProfile.join_date)}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Music className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Voice Part:</span>
                <span className="ml-auto font-medium">{formatVoicePart(displayProfile.voice_part)}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <SquareUser className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Class Year:</span>
                <span className="ml-auto font-medium">{displayProfile.class_year || "Not specified"}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Banknote className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Dues Paid:</span>
                <span className="ml-auto font-medium">
                  {displayProfile.dues_paid ? (
                    <Badge variant="success">Paid</Badge>
                  ) : (
                    <Badge variant="destructive">Unpaid</Badge>
                  )}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="notes">{isAdmin() ? 'Admin Notes' : 'Notes'}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{displayProfile.email || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{displayProfile.phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Membership Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">{displayProfile.status || "Unknown"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Role</p>
                          <p className="font-medium">{displayProfile.role || "Member"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Active</p>
                          <p className="font-medium">{formatDate(displayProfile.last_sign_in_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="participation">
              <Card>
                <CardHeader>
                  <CardTitle>Participation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Attendance and participation records for this member will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="music">
              <Card>
                <CardHeader>
                  <CardTitle>Music Access & Voice Part</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Voice Part</h3>
                    <p>{formatVoicePart(displayProfile.voice_part)}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Sheet Music Access</h3>
                    <p className="text-muted-foreground">
                      Assigned sheet music and access rights will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>{isAdmin() ? 'Administrative Notes' : 'Notes'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-muted-foreground">
                      {displayProfile.notes || "No notes available for this member."}
                    </p>
                  </div>
                  
                  {isAdmin() && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Special Roles</h3>
                      <p className="text-muted-foreground">
                        {displayProfile.special_roles || "No special roles assigned."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Delete User Dialog */}
      <DeleteUserDialog
        user={userToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteConfirm={handleDeleteUser}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

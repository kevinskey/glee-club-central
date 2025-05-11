import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Search, Filter, UserPlus, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useUserManagement } from "@/hooks/useUserManagement";
import { MembersList } from "@/components/members/MembersList";
import { useMedia } from "@/hooks/use-mobile";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { UserFormValues } from "@/components/members/form/userFormSchema";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";
import { User } from "@/hooks/useUserManagement";
import { Separator } from "@/components/ui/separator";
import { MemberPermissionsDialog } from "@/components/members/MemberPermissionsDialog";
import { UserRoleSelector } from "@/components/members/UserRoleSelector";
import { createMemberRefreshFunction } from "@/components/members/MembersPageRefactor";
import { deleteUser as deleteUserUtil } from "@/utils/admin/userDelete";

type UserRoleType = "admin" | "student" | "section_leader" | "staff" | "guest";
type VoicePartType = "soprano_1" | "soprano_2" | "alto_1" | "alto_2" | "tenor" | "bass";
type StatusType = "active" | "pending" | "inactive" | "alumni";

export default function MembersPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [voicePartFilter, setVoicePartFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<User | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [memberToDeleteName, setMemberToDeleteName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useMedia('(max-width: 640px)');
  const { hasPermission } = usePermissions();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  
  // Making this always true so the Add Member button is always shown
  // We'll temporarily bypass permission checks
  const canManageMembers = true;
  
  const {
    users: allMembers,
    isLoading,
    fetchUsers,
    addUser,
    updateUser,
    updateUserRole,
    updateUserStatus,
    deleteUser
  } = useUserManagement();
  
  // Filter out deleted users
  const members = allMembers.filter(member => member.status !== 'deleted');
  
  // Fetch members on component mount
  useEffect(() => {
    console.log("MembersPage - Fetching users");
    fetchUsers().catch(err => {
      console.error("Error fetching users:", err);
      toast.error("Failed to load members");
    });
  }, [fetchUsers]);

  // Handle adding a new member
  const handleAddMember = async (data: UserFormValues) => {
    // Temporarily allowing all users to add members by removing permission check
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setIsAddMemberDialogOpen(false);
        toast.success(`Added ${data.first_name} ${data.last_name}`);
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle editing a member
  const handleEditMember = (member: User) => {
    console.log("Opening edit dialog for member:", member);
    setCurrentMember(member);
    setIsEditMemberDialogOpen(true);
  };
  
  // Handle updating a member
  const handleUpdateMember = async (data: UserFormValues) => {
    if (!currentMember) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateUser(currentMember.id, data);
      if (success) {
        setIsEditMemberDialogOpen(false);
        setCurrentMember(null);
        toast.success(`Updated ${data.first_name} ${data.last_name}`);
        await fetchUsers(); // Refresh the list after update
      }
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle changing a member's role
  const handleChangeRole = (member: User) => {
    console.log("Opening role selector for:", member);
    setCurrentMember(member);
    setIsRoleDialogOpen(true);
  };

  // Handle managing permissions
  const handleManagePermissions = (member: User) => {
    setCurrentMember(member);
    setIsPermissionsDialogOpen(true);
  };

  // Handle status update success (added for UI refresh)
  const handleStatusUpdateSuccess = async () => {
    console.log("Status updated, refreshing member list");
    await fetchUsers();
    toast.success("Member status updated successfully");
  };

  // Handle deleting a member
  const handleDeleteClick = (memberId: string) => {
    console.log("Requesting delete for member ID:", memberId);
    const member = members.find(m => m.id === memberId);
    if (member) {
      setMemberToDelete(memberId);
      setMemberToDeleteName(`${member.first_name || ''} ${member.last_name || ''}`.trim() || 'this member');
      setIsDeleteDialogOpen(true);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    
    setIsDeleting(true);
    try {
      // Using the utility function for deletion
      await deleteUserUtil(memberToDelete);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
      toast.success(`${memberToDeleteName} has been removed from the member list`);
      // Refresh the list after deletion
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setVoicePartFilter("all");
    setStatusFilter("all");
    setActiveTab("all");
  };

  // Filter members based on search query and filters
  const filteredMembers = React.useMemo(() => {
    return members.filter(member => {
      // First apply search filter
      const matchesSearch = 
        !searchQuery || 
        (member.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Then apply dropdown filters
      const matchesRole = roleFilter === "all" || (member.role || '') === roleFilter;
      const matchesVoicePart = voicePartFilter === "all" || (member.voice_part || '') === voicePartFilter;
      const matchesStatus = statusFilter === "all" || (member.status || '') === statusFilter;
      
      if (!matchesRole || !matchesVoicePart || !matchesStatus) return false;
      
      // Then apply tab filter
      if (activeTab === "all") return true;
      if (activeTab === "active" && member.status === "active") return true;
      if (activeTab === "inactive" && member.status !== "active") return true;
      
      return false;
    });
  }, [members, searchQuery, roleFilter, voicePartFilter, statusFilter, activeTab]);

  console.log("MembersPage rendering", { 
    memberCount: members.length, 
    filteredCount: filteredMembers.length,
    isLoading, 
    authLoading,
    canManageMembers
  });

  // Create a wrapper function for fetchUsers that returns void
  const refreshMembers = createMemberRefreshFunction(fetchUsers);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <PageHeader
          title="Glee Club Members"
          description="View and manage all Spelman College Glee Club members"
          icon={<Users className="h-6 w-6" />}
        />
        
        {hasPermission('can_manage_users') && (
          <Link to="/dashboard/admin/members">
            <Button 
              variant="secondary" 
              className="mt-4 sm:mt-0"
            >
              <Settings className="h-4 w-4 mr-2" />
              Advanced Member Management
            </Button>
          </Link>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Tabs navigation for quick filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            {/* Show Add Member button for all users */}
            <Button 
              onClick={() => setIsAddMemberDialogOpen(true)}
              className="bg-brand hover:bg-brand/90"
              size={isMobile ? "sm" : "default"}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {isMobile ? 'Add' : 'Add Member'}
            </Button>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <Card className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-end">
                  {/* Search and filter controls */}
                  <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search members..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    {!isMobile && (
                      <>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="administrator">Administrator</SelectItem>
                            <SelectItem value="section_leader">Section Leader</SelectItem>
                            <SelectItem value="student_conductor">Student Conductor</SelectItem>
                            <SelectItem value="accompanist">Accompanist</SelectItem>
                            <SelectItem value="singer">Singer</SelectItem>
                            <SelectItem value="non_singer">Non-Singer</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={voicePartFilter} onValueChange={setVoicePartFilter}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Voice Part" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Voice Parts</SelectItem>
                            <SelectItem value="soprano_1">Soprano 1</SelectItem>
                            <SelectItem value="soprano_2">Soprano 2</SelectItem>
                            <SelectItem value="alto_1">Alto 1</SelectItem>
                            <SelectItem value="alto_2">Alto 2</SelectItem>
                            <SelectItem value="tenor">Tenor</SelectItem>
                            <SelectItem value="bass">Bass</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="alumni">Alumni</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    {isMobile && (
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filters
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Member count summary */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {filteredMembers.length === members.length ? (
                      <span>Showing all {members.length} members</span>
                    ) : (
                      <span>Showing {filteredMembers.length} of {members.length} members</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-background text-foreground">
                      Active: {members.filter(m => m.status === 'active').length}
                    </Badge>
                    <Badge variant="outline" className="bg-background text-foreground">
                      Pending: {members.filter(m => m.status === 'pending').length}
                    </Badge>
                  </div>
                </div>
                
                {/* Display loading state, empty state, or member list */}
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-muted-foreground mb-4">No members found matching your criteria.</p>
                    <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                  </div>
                ) : (
                  <MembersList 
                    members={filteredMembers} 
                    onEditMember={canManageMembers ? handleEditMember : undefined}
                    onDeleteMember={canManageMembers ? handleDeleteClick : undefined}
                    onManagePermissions={canManageMembers ? handleManagePermissions : undefined}
                    onChangeRole={canManageMembers ? handleChangeRole : undefined}
                    onStatusUpdate={updateUserStatus}
                    onStatusUpdateSuccess={handleStatusUpdateSuccess}
                  />
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <Card className="p-4">
              {/* Same filter controls and member list as the "all" tab but with activeTab="active" */}
              <p className="text-muted-foreground">Showing only active members</p>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <MembersList 
                  members={filteredMembers} 
                  onEditMember={canManageMembers ? handleEditMember : undefined}
                  onDeleteMember={canManageMembers ? handleDeleteClick : undefined}
                  onManagePermissions={canManageMembers ? handleManagePermissions : undefined}
                  onChangeRole={canManageMembers ? handleChangeRole : undefined}
                  onStatusUpdate={updateUserStatus}
                  onStatusUpdateSuccess={handleStatusUpdateSuccess}
                />
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-0">
            <Card className="p-4">
              {/* Same filter controls and member list as the "all" tab but with activeTab="inactive" */}
              <p className="text-muted-foreground">Showing pending, inactive, and alumni members</p>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <MembersList 
                  members={filteredMembers} 
                  onEditMember={canManageMembers ? handleEditMember : undefined}
                  onDeleteMember={canManageMembers ? handleDeleteClick : undefined}
                  onManagePermissions={canManageMembers ? handleManagePermissions : undefined}
                  onChangeRole={canManageMembers ? handleChangeRole : undefined}
                  onStatusUpdate={updateUserStatus}
                  onStatusUpdateSuccess={handleStatusUpdateSuccess}
                />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Member Dialog - Available to all users now */}
      <AddMemberDialog
        isOpen={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onMemberAdd={handleAddMember}
        isSubmitting={isSubmitting}
      />
      
      {/* Edit Member Dialog - We'll reuse AddMemberDialog with initial values */}
      {canManageMembers && currentMember && (
        <AddMemberDialog
          isOpen={isEditMemberDialogOpen}
          onOpenChange={setIsEditMemberDialogOpen}
          onMemberAdd={handleUpdateMember}
          isSubmitting={isSubmitting}
          initialValues={{
            first_name: currentMember.first_name || '',
            last_name: currentMember.last_name || '',
            email: currentMember.email || '',
            phone: currentMember.phone || '',
            role: (currentMember.role as UserRoleType) || 'student',
            voice_part: (currentMember.voice_part as VoicePartType) || null,
            status: (currentMember.status as StatusType) || 'active',
            class_year: currentMember.class_year || '',
            notes: currentMember.notes || '',
            dues_paid: currentMember.dues_paid || false,
            password: ''
          }}
          isEditing={true}
        />
      )}
      
      {/* Delete Member Dialog */}
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        memberName={memberToDeleteName}
        isDeleting={isDeleting}
      />
      
      {/* Role Selector Dialog */}
      <UserRoleSelector
        user={currentMember}
        isOpen={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        onSuccess={refreshMembers}
      />
      
      {/* Permissions Dialog */}
      {canManageMembers && (
        <MemberPermissionsDialog
          user={currentMember}
          isOpen={isPermissionsDialogOpen}
          setIsOpen={setIsPermissionsDialogOpen}
          onSuccess={refreshMembers}
        />
      )}
    </div>
  );
}

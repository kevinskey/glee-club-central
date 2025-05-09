
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Search, Filter, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserManagement } from "@/hooks/useUserManagement";
import { MembersList } from "@/components/members/MembersList";
import { useMedia } from "@/hooks/use-mobile";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { UserFormValues } from "@/components/members/form/userFormSchema";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";
import { User } from "@/hooks/useUserManagement";

export default function MembersPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [voicePartFilter, setVoicePartFilter] = useState("");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<User | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [memberToDeleteName, setMemberToDeleteName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useMedia('(max-width: 640px)');
  const { hasPermission } = usePermissions();
  
  const {
    users: members,
    isLoading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  } = useUserManagement();
  
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
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setIsAddMemberDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle editing a member
  const handleEditMember = (member: User) => {
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
      }
    } catch (error) {
      console.error("Error updating member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle deleting a member
  const handleDeleteClick = (memberId: string) => {
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
      await deleteUser(memberToDelete);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Error deleting member:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter members based on search query and filters
  const filteredMembers = React.useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        (member.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = !roleFilter || (member.role || '') === roleFilter;
      const matchesVoicePart = !voicePartFilter || (member.voice_part || '') === voicePartFilter;
      
      return matchesSearch && matchesRole && matchesVoicePart;
    });
  }, [members, searchQuery, roleFilter, voicePartFilter]);

  // Check if user has permission to add members
  const canManageMembers = hasPermission('can_manage_users');

  console.log("MembersPage rendering", { 
    memberCount: members.length, 
    isLoading, 
    authLoading,
    canManageMembers
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Glee Club Members"
        description="View all Spelman College Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("");
                setVoicePartFilter("");
              }}
            >
              Reset
            </Button>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              {isMobile ? '' : 'Filter'}
            </Button>
            
            {canManageMembers && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsAddMemberDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {isMobile ? '' : 'Add Member'}
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <MembersList 
            members={filteredMembers} 
            onEditMember={canManageMembers ? handleEditMember : undefined}
            onDeleteMember={canManageMembers ? handleDeleteClick : undefined}
          />
        )}
      </Card>
      
      {/* Add Member Dialog */}
      {canManageMembers && (
        <AddMemberDialog
          isOpen={isAddMemberDialogOpen}
          onOpenChange={setIsAddMemberDialogOpen}
          onMemberAdd={handleAddMember}
          isSubmitting={isSubmitting}
        />
      )}
      
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
            role: currentMember.role || 'singer',
            voice_part: currentMember.voice_part || 'soprano_1',
            status: currentMember.status || 'pending',
            password: ''
          }}
          isEditing={true}
        />
      )}
      
      {/* Delete Member Dialog */}
      {canManageMembers && (
        <DeleteMemberDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          memberName={memberToDeleteName}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

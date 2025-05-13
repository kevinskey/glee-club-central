
import React, { useEffect, useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { User } from "@/hooks/useUserManagement";
import { MembersList } from "@/components/members/MembersList";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { UserFormValues } from "@/components/members/form/userFormSchema";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";

const MembersPage: React.FC = () => {
  // State for members and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [memberToDeleteName, setMemberToDeleteName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get user management functions
  const { 
    users: allMembers, 
    isLoading, 
    fetchUsers, 
    addUser,
    deleteUser 
  } = useUserManagement();
  
  // Filter out deleted members
  const members = allMembers ? allMembers.filter(member => member.status !== 'deleted') : [];

  // Fetch members on component mount
  useEffect(() => {
    console.log("MembersPage - Fetching members");
    fetchUsers();
  }, [fetchUsers]);

  // Filter members when search query changes
  useEffect(() => {
    const filtered = members.filter(member => 
      !searchQuery || 
      member.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [members, searchQuery]);

  // Handle adding a member
  const handleAddMember = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setIsAddMemberDialogOpen(false);
        toast.success(`Added ${data.first_name} ${data.last_name} successfully`);
      } else {
        toast.error("Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a member - FIXED to work with both User object or string ID
  const handleDeleteMember = (memberIdOrUser: User | string) => {
    // Check if the parameter is a string (ID) or a User object
    const memberId = typeof memberIdOrUser === 'string' ? memberIdOrUser : memberIdOrUser.id;
    const member = typeof memberIdOrUser === 'string' 
      ? members.find(m => m.id === memberIdOrUser)
      : memberIdOrUser;
      
    if (member) {
      setMemberToDelete(memberId);
      setMemberToDeleteName(`${member.first_name || ''} ${member.last_name || ''}`);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteUser(memberToDelete);
      if (success) {
        setIsDeleteDialogOpen(false);
        setMemberToDelete(null);
        toast.success(`${memberToDeleteName} has been removed`);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Members Directory"
        description="Connect with your fellow Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full sm:w-auto flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button
              onClick={() => setIsAddMemberDialogOpen(true)}
              className="w-full sm:w-auto bg-brand hover:bg-brand/90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No members found</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddMemberDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add your first member
              </Button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No members matching your search</p>
            </div>
          ) : (
            <MembersList 
              members={filteredMembers} 
              onEditMember={handleDeleteMember}
              onDeleteMember={handleDeleteMember}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Add Member Dialog */}
      <AddMemberDialog
        isOpen={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onMemberAdd={handleAddMember}
        isSubmitting={isSubmitting}
      />
      
      {/* Delete Member Dialog */}
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        memberName={memberToDeleteName}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default MembersPage;

import React, { useState, useCallback } from "react";
import { User } from "@/hooks/useUserManagement";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useMedia } from "@/hooks/use-mobile";
import { MembersList } from "@/components/members/MembersList";
import { UserManagementToolbar } from "@/components/members/UserManagementToolbar";
import { UserTitleManagement } from "@/components/admin/UserTitleManagement";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { UserFormValues } from "@/components/members/form/userFormSchema";
import { toast } from "sonner";
import { EditUserDialog } from "@/components/members/EditUserDialog";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";
import { MemberPermissionsDialog } from "@/components/members/MemberPermissionsDialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

// Helper function to create a member refresh function that returns void
export const createMemberRefreshFunction = (
  fetchUsers: () => Promise<any>
): (() => Promise<void>) => {
  return async () => {
    try {
      await fetchUsers();
    } catch (error) {
      console.error("Error refreshing members:", error);
    }
  };
};

// Type for the MembersPageComponent props
export interface MembersPageProps {
  useUserManagementHook: () => {
    users: User[];
    isLoading: boolean;
    fetchUsers: () => Promise<any>;
    addUser: (data: UserFormValues) => Promise<boolean>;
    updateUser?: (userId: string, data: any) => Promise<boolean>;
    deleteUser?: (userId: string) => Promise<boolean>;
  };
}

export function MembersPageComponent({ useUserManagementHook }: MembersPageProps) {
  // All hooks at the top
  const { isAdmin, isLoading: authLoading, isAuthenticated, profile } = useAuth();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const isMobile = useMedia('(max-width: 640px)');
  
  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Dialog state - ensure they are properly initialized
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isManageRoleOpen, setIsManageRoleOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // User to delete
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState("");
  
  // Get user management data and functions
  const {
    users: allMembers,
    isLoading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  } = useUserManagementHook();
  
  console.log("MembersPageComponent - Initializing with", allMembers?.length || 0, "members");
  console.log("MembersPageComponent - Members sample:", allMembers?.slice(0, 2));
  
  // Explicitly filter out deleted users
  const members = allMembers ? allMembers.filter(member => member.status !== 'deleted') : [];
  console.log("MembersPageComponent - Active members:", members.length);
  
  // Create a wrapper function for fetchUsers that returns void
  const refreshUsers = createMemberRefreshFunction(fetchUsers);

  // Memoize handlers to prevent unnecessary re-renders
  const handleRoleUpdateSuccess = useCallback(async () => {
    await refreshUsers();
    toast.success("Member list refreshed");
  }, [refreshUsers]);
  
  // Handler functions
  const handleAddMember = useCallback(async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Adding member with data:", data);
      const success = await addUser(data);
      if (success) {
        setIsAddMemberOpen(false);
        toast.success(`Added ${data.first_name} ${data.last_name} successfully`);
        // No need to call refreshUsers here since we're adding the user to local state in addUser function
      } else {
        toast.error("Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  }, [addUser]);

  // Handle updating a user's information
  const handleUpdateUser = useCallback(async (data: UserFormValues) => {
    if (!selectedUser || !updateUser) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateUser(selectedUser.id, data);
      if (success) {
        setIsEditUserOpen(false);
        setSelectedUser(null);
        toast.success(`Updated ${data.first_name} ${data.last_name} successfully`);
        await refreshUsers();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedUser, updateUser, refreshUsers]);
  
  // Handle deleting a user
  const handleDeleteUser = useCallback((userId: string) => {
    const user = members.find(m => m.id === userId);
    if (user) {
      setUserToDelete(userId);
      setUserToDeleteName(`${user.first_name} ${user.last_name}`);
      setIsDeleteDialogOpen(true);
    }
  }, [members]);
  
  const confirmDeleteUser = useCallback(async () => {
    if (!userToDelete || !deleteUser) return;
    
    setIsDeleting(true);
    try {
      // Call the deleteUser function from the hook
      const success = await deleteUser(userToDelete);
      
      if (success) {
        // The deleteUser function now handles removing the user from the local state
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
        toast.success(`${userToDeleteName} has been deleted`);
      } else {
        toast.error(`Failed to delete ${userToDeleteName}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  }, [userToDelete, deleteUser, userToDeleteName]);

  // Check if user has admin privileges
  const hasAdminAccess = (isAdmin && isAdmin()) || isSuperAdmin || profile?.is_super_admin || hasPermission('can_manage_users');

  // Use conditional rendering instead of early returns for auth checks
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("MembersPageComponent - Access denied, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  if (!hasAdminAccess) {
    console.log("MembersPageComponent - Not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" />;
  }
  
  // Render the content
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Member Management"
        description="View and manage all Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <UserManagementToolbar 
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreateUserClick={() => {
            console.log("Opening add member dialog");
            setIsAddMemberOpen(true);
          }}
          onRefreshClick={() => {
            console.log("Refreshing user list");
            fetchUsers().then(() => {
              console.log("User list refreshed, now have", allMembers?.length || 0, "users");
            });
          }}
          isLoading={isLoading}
          isMobile={isMobile}
          canCreate={hasAdminAccess}
        />
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Spinner size="lg" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-2">No members found</p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddMemberOpen(true)}
              className="mt-2"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add your first member
            </Button>
          </div>
        ) : (
          <MembersList 
            members={members} 
            onEditUser={(user) => {
              setSelectedUser(user);
              setIsEditUserOpen(true);
            }}
            onDeleteUser={handleDeleteUser}
            onManagePermissions={(user) => {
              setSelectedUser(user);
              setIsPermissionsOpen(true);
            }}
            onChangeRole={(user) => {
              setSelectedUser(user);
              setIsManageRoleOpen(true);
            }}
            canEdit={hasAdminAccess}
            // Pass both onEditMember and onDeleteMember to maintain compatibility
            onEditMember={(user) => {
              setSelectedUser(user);
              setIsEditUserOpen(true);
            }}
            onDeleteMember={handleDeleteUser}
          />
        )}
      </Card>
      
      {/* Role Management Dialog */}
      <UserTitleManagement
        user={selectedUser}
        isOpen={isManageRoleOpen}
        setIsOpen={setIsManageRoleOpen}
        onSuccess={handleRoleUpdateSuccess}
      />
      
      {/* Add Member Dialog */}
      {isAddMemberOpen && (
        <AddMemberDialog
          isOpen={isAddMemberOpen}
          onOpenChange={setIsAddMemberOpen}
          onMemberAdd={handleAddMember}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Edit User Dialog */}
      {updateUser && isEditUserOpen && selectedUser && (
        <EditUserDialog
          isOpen={isEditUserOpen}
          onOpenChange={setIsEditUserOpen}
          onSave={handleUpdateUser}
          isSubmitting={isSubmitting}
          user={selectedUser}
        />
      )}
      
      {/* Delete User Dialog */}
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        memberName={userToDeleteName}
        isDeleting={isDeleting}
      />
      
      {/* Permissions Dialog */}
      <MemberPermissionsDialog
        user={selectedUser}
        isOpen={isPermissionsOpen}
        setIsOpen={setIsPermissionsOpen}
        onSuccess={refreshUsers}
      />
    </div>
  );
}

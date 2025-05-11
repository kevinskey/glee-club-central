
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
  // Get auth and permissions
  const { isAdmin, isLoading: authLoading, isAuthenticated, profile } = useAuth();
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Dialog state
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
  const isMobile = useMedia('(max-width: 640px)');
  
  // Get user management data and functions
  const {
    users: allMembers,
    isLoading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  } = useUserManagementHook();
  
  // Filter out deleted users
  const members = allMembers.filter(member => member.status !== 'deleted');
  
  // Create a wrapper function for fetchUsers that returns void
  const refreshUsers = createMemberRefreshFunction(fetchUsers);

  // Memoize handlers to prevent unnecessary re-renders
  const handleRoleUpdateSuccess = useCallback(async () => {
    await refreshUsers();
    toast.success("Member list refreshed");
  }, [refreshUsers]);
  
  // Handle adding a new member
  const handleAddMember = useCallback(async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setIsAddMemberOpen(false);
        toast.success(`Added ${data.first_name} ${data.last_name} successfully`);
        await refreshUsers();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [addUser, refreshUsers]);

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
      const success = await deleteUser(userToDelete);
      if (success) {
        setIsDeleteDialogOpen(false);
        toast.success(`${userToDeleteName} has been deleted`);
        await refreshUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  }, [userToDelete, deleteUser, userToDeleteName, refreshUsers]);

  // Check if user has admin privileges
  const hasAdminAccess = isAdmin?.() || isSuperAdmin || profile?.is_super_admin || hasPermission('can_manage_users');

  // Only redirect if no admin access
  if (!authLoading && isAuthenticated && !hasAdminAccess) {
    console.log("AdminMembersPage - Access denied, redirecting to dashboard");
    return <Navigate to="/dashboard" />;
  }
  
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Filter members based on search query and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      (member.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || (member.role || '') === roleFilter;
    const matchesStatus = statusFilter === "all" || (member.status || '') === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
          onCreateUserClick={() => setIsAddMemberOpen(true)}
          onRefreshClick={refreshUsers}
          isLoading={isLoading}
          isMobile={isMobile}
          canCreate={hasAdminAccess}
        />
        
        <MembersList 
          members={filteredMembers}
          onChangeRole={(user) => {
            setSelectedUser(user);
            setIsManageRoleOpen(true);
          }}
          onEditUser={(user) => {
            setSelectedUser(user);
            setIsEditUserOpen(true);
          }}
          onDeleteUser={handleDeleteUser}
          onManagePermissions={(user) => {
            setSelectedUser(user);
            setIsPermissionsOpen(true);
          }}
          canEdit={hasAdminAccess}
        />
      </Card>
      
      {/* Role Management Dialog */}
      <UserTitleManagement
        user={selectedUser}
        isOpen={isManageRoleOpen}
        setIsOpen={setIsManageRoleOpen}
        onSuccess={handleRoleUpdateSuccess}
      />
      
      {/* Add Member Dialog */}
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onMemberAdd={handleAddMember}
        isSubmitting={isSubmitting}
      />
      
      {/* Edit User Dialog */}
      {updateUser && (
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

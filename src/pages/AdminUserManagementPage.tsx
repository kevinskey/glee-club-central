
import React, { useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminUserManagement } from "@/hooks/useAdminUserManagement";
import { UserManagementToolbar } from "@/components/members/UserManagementToolbar";
import { UsersTableSimple } from "@/components/members/UsersTableSimple";
import { UserDialogs } from "@/components/members/UserDialogs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminUserManagementPage() {
  const { isAdmin } = useAuth();
  const {
    users,
    filteredUsers,
    isLoading,
    isSubmitting,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isCreateUserOpen,
    setIsCreateUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedUser,
    userToDelete,
    fetchUsers,
    formatDate,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    openEditUserDialog,
    openDeleteUserDialog,
    changeUserRole,
    changeUserStatus,
    filterUsers
  } = useAdminUserManagement();

  // Filter users whenever dependencies change
  const applyFilters = useCallback(() => {
    filterUsers(users);
  }, [users, searchTerm, roleFilter, statusFilter, filterUsers]);

  // Apply filters when dependencies change, using memoized function
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  // On mount, fetch users once
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle unauthorized access
  if (!isAdmin()) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <UserCog className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  // Handle role change with improved error handling and feedback
  const handleRoleChange = async (userId: string, role: string): Promise<void> => {
    try {
      console.log(`AdminUserManagementPage: Changing role for ${userId} to ${role}`);
      const success = await changeUserRole(userId, role);
      
      if (!success) {
        toast.error(`Failed to update user role to ${role}`);
        console.error("Role change returned false");
      } else {
        // Force a refresh of user data after role change is successful
        setTimeout(() => {
          fetchUsers();
        }, 500);
      }
    } catch (error) {
      console.error("Role change error:", error);
      toast.error("An error occurred while updating user role");
    }
  };

  // Handle status change with improved feedback
  const handleStatusChange = async (userId: string, status: string): Promise<void> => {
    try {
      const success = await changeUserStatus(userId, status);
      if (!success) {
        toast.error(`Failed to update user status to ${status}`);
      } else {
        // Force a refresh of user data after status change is successful
        setTimeout(() => {
          fetchUsers();
        }, 500);
      }
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("An error occurred while updating user status");
    }
  };

  // Handle delete user with optimized UI update
  const handleUserDelete = async () => {
    try {
      await handleDeleteUser();
      // Refresh will be triggered by the useUserDelete hook
    } catch (error) {
      console.error("Error handling user delete:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Management"
        description="Create, edit, and manage Glee Club members with advanced controls"
        icon={<UserCog className="h-6 w-6" />}
      />

      <Card>
        <CardContent className="p-6">
          <UserManagementToolbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onCreateUserClick={() => setIsCreateUserOpen(true)}
            onRefreshClick={fetchUsers}
            isLoading={isLoading}
          />

          <ScrollArea className="relative w-full">
            <div className="w-full min-w-max">
              <UsersTableSimple 
                users={filteredUsers}
                isLoading={isLoading}
                onViewDetails={openEditUserDialog}
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
                formatDate={formatDate}
                onDeleteClick={openDeleteUserDialog}
              />
            </div>
          </ScrollArea>
          
          <div className="mt-4 text-sm text-gray-500" key={`user-count-${filteredUsers.length}`}>
            Total: {filteredUsers.length} users
          </div>
        </CardContent>
      </Card>

      <UserDialogs
        isCreateUserOpen={isCreateUserOpen}
        setIsCreateUserOpen={setIsCreateUserOpen}
        isEditUserOpen={isEditUserOpen}
        setIsEditUserOpen={setIsEditUserOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        userToDelete={userToDelete}
        isSubmitting={isSubmitting}
        onCreateUser={handleCreateUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleUserDelete}
      />
    </div>
  );
}

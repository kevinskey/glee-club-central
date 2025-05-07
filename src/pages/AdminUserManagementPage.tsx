
import React, { useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminUserManagement } from "@/hooks/useAdminUserManagement";
import { UserManagementToolbar } from "@/components/members/UserManagementToolbar";
import { UsersTableSimple } from "@/components/members/UsersTableSimple";
import { UserDialogs } from "@/components/members/UserDialogs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

  // Filter users when dependencies change
  useEffect(() => {
    filterUsers(users);
  }, [users, searchTerm, roleFilter, statusFilter, filterUsers]);

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

  // Handle role change with full error handling and feedback
  const handleRoleChange = async (userId: string, role: string): Promise<void> => {
    try {
      console.log(`AdminUserManagementPage: Changing role for ${userId} to ${role}`);
      const success = await changeUserRole(userId, role);
      if (!success) {
        toast.error(`Failed to update user role to ${role}`);
      }
      // Re-fetch users to get updated data after role change
      await fetchUsers();
    } catch (error) {
      console.error("Role change error:", error);
      toast.error("An error occurred while updating user role");
    }
  };

  // Handle status change with full error handling and feedback
  const handleStatusChange = async (userId: string, status: string): Promise<void> => {
    try {
      const success = await changeUserStatus(userId, status);
      if (!success) {
        toast.error(`Failed to update user status to ${status}`);
      }
      // Re-fetch users to get updated data after status change
      await fetchUsers();
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("An error occurred while updating user status");
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

          <UsersTableSimple 
            users={filteredUsers}
            isLoading={isLoading}
            onViewDetails={openEditUserDialog}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
            formatDate={formatDate}
          />
          
          <div className="mt-4 text-sm text-gray-500">
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
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}


import React, { useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { UserCog, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminUserManagement } from "@/hooks/useAdminUserManagement";
import { UserManagementToolbar } from "@/components/members/UserManagementToolbar";
import { UsersTableSimple } from "@/components/members/UsersTableSimple";
import { UserDialogs } from "@/components/members/UserDialogs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";

export default function AdminUserManagementPage() {
  const { userProfile } = useAuth();
  const permissions = usePermissions();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
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

  // Handle unauthorized access with redirect
  useEffect(() => {
    if (!permissions.canEditUsers && !permissions.canAccessAdminFeatures) {
      toast.error("You don't have permission to access this page");
      navigate('/dashboard');
    }
  }, [permissions, navigate]);

  // If user doesn't have required permissions
  if (!permissions.canEditUsers && !permissions.canAccessAdminFeatures) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">You need administrator permissions to access this page.</p>
        </div>
      </div>
    );
  }

  // Handle role change with improved error handling
  const handleRoleChange = async (userId: string, role: string): Promise<void> => {
    try {
      // Check if user has permission to change roles
      if (!permissions.canEditUsers) {
        toast.error("You don't have permission to change user roles");
        return;
      }
      
      console.log(`AdminUserManagementPage: Changing role for ${userId} to ${role}`);
      const success = await changeUserRole(userId, role);
      
      if (!success) {
        toast.error(`Failed to update user role to ${role}`);
      } else {
        toast.success(`User role updated to ${role}`);
        // Force a refresh of user data after role change is successful
        setTimeout(() => {
          fetchUsers();
        }, 300);
      }
    } catch (error) {
      console.error("Role change error:", error);
      toast.error("An error occurred while updating user role");
    }
  };

  // Handle status change with improved feedback
  const handleStatusChange = async (userId: string, status: string): Promise<void> => {
    try {
      // Check if user has permission to change status
      if (!permissions.canEditUsers) {
        toast.error("You don't have permission to change user status");
        return;
      }
      
      const success = await changeUserStatus(userId, status);
      if (!success) {
        toast.error(`Failed to update user status to ${status}`);
      } else {
        toast.success(`User status updated to ${status}`);
        // Force a refresh of user data after status change is successful
        setTimeout(() => {
          fetchUsers();
        }, 300);
      }
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("An error occurred while updating user status");
    }
  };

  // Handle delete user with immediate UI update and error prevention
  const handleUserDelete = async () => {
    try {
      // Check if user has permission to delete users
      if (!permissions.canDeleteUsers) {
        toast.error("You don't have permission to delete users");
        return;
      }
      
      await handleDeleteUser();
      // Force a refresh of the user data after successful deletion
      setTimeout(() => {
        fetchUsers();
      }, 500);
    } catch (error) {
      console.error("Error handling user delete:", error);
      toast.error("Failed to delete user. Please try again.");
      // Still fetch users to ensure UI is in sync with backend
      fetchUsers();
    }
  };
  
  // Check if user has view-only access
  const isViewOnly = !permissions.canEditUsers && permissions.canAccessAdminFeatures;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Management"
        description={isViewOnly ? 
          "View Glee Club members (view-only access)" : 
          "Create, edit, and manage Glee Club members with advanced controls"}
        icon={<UserCog className="h-6 w-6" />}
      />

      <Card>
        <CardContent className={`p-2 sm:p-4 md:p-6`}>
          <UserManagementToolbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onCreateUserClick={() => permissions.canEditUsers ? setIsCreateUserOpen(true) : toast.error("You don't have permission to create users")}
            onRefreshClick={fetchUsers}
            isLoading={isLoading}
            isMobile={isMobile}
            canCreate={permissions.canEditUsers}
          />

          <div className="w-full overflow-hidden">
            <ScrollArea className="w-full">
              <div className={isMobile ? "min-w-[320px] w-full" : "min-w-[600px] w-full"}>
                <UsersTableSimple 
                  users={filteredUsers}
                  isLoading={isLoading}
                  onViewDetails={(user) => {
                    if (permissions.canEditUsers) {
                      openEditUserDialog(user);
                    } else {
                      // Navigate to user profile page instead for view-only users
                      navigate(`/dashboard/members/${user.id}`);
                    }
                  }}
                  onRoleChange={handleRoleChange}
                  onStatusChange={handleStatusChange}
                  formatDate={formatDate}
                  onDeleteClick={permissions.canDeleteUsers ? openDeleteUserDialog : undefined}
                  isMobile={isMobile}
                  isViewOnly={isViewOnly}
                />
              </div>
            </ScrollArea>
          </div>
          
          <div className="mt-4 text-sm text-gray-500" key={`user-count-${filteredUsers.length}`}>
            Total: {filteredUsers.length} users {isViewOnly && " (view-only)"}
          </div>
        </CardContent>
      </Card>

      {permissions.canEditUsers && (
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
      )}
    </div>
  );
}

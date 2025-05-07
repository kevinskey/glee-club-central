
import { useState } from "react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useUserFilter } from "@/hooks/user-management/useUserFilter";
import { useUserCreate } from "@/hooks/user-management/useUserCreate";
import { useUserEdit } from "@/hooks/user-management/useUserEdit";
import { useUserDelete } from "@/hooks/user-management/useUserDelete";
import { formatDate, openEditUserDialog as openEditDialog } from "@/hooks/user-management/userUtils";

export function useAdminUserManagement() {
  const {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    fetchUsers,
    changeUserRole,
    changeUserStatus
  } = useUserManagement();

  // Incorporate the filter hook
  const {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    filteredUsers,
    filterUsers
  } = useUserFilter(users);

  // Incorporate the create user hook
  const {
    isCreateUserOpen,
    setIsCreateUserOpen,
    isSubmitting: isCreateSubmitting,
    handleCreateUser
  } = useUserCreate(fetchUsers);

  // Incorporate the edit user hook
  const {
    isEditUserOpen,
    setIsEditUserOpen,
    isSubmitting: isEditSubmitting,
    handleEditUser
  } = useUserEdit(selectedUser, fetchUsers);

  // Incorporate the delete user hook
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    isSubmitting: isDeleteSubmitting,
    handleDeleteUser,
    openDeleteUserDialog
  } = useUserDelete(fetchUsers);

  // Combined submitting state for UI purposes
  const isSubmitting = isCreateSubmitting || isEditSubmitting || isDeleteSubmitting;

  // Open edit user dialog wrapper that uses the utility function
  const openEditUserDialog = (user: any) => {
    openEditDialog(user, setSelectedUser, setIsEditUserOpen);
  };

  return {
    users,
    filteredUsers,
    selectedUser,
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
  };
}

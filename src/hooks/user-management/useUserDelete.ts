
import { useState } from "react";
import { deleteUser } from "@/utils/admin";
import { toast } from "sonner";
import { User } from "@/hooks/useUserManagement";

export function useUserDelete(onSuccess: () => void) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle delete user
  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    try {
      if (!userToDelete) return;
      
      const result = await deleteUser(userToDelete.id);
      
      if (result.success) {
        toast.success(`User ${userToDelete.email} deleted successfully`);
        onSuccess();
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Error deleting user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete user dialog
  const openDeleteUserDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    isSubmitting,
    handleDeleteUser,
    openDeleteUserDialog
  };
}

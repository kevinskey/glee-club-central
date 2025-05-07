
import { useState, useCallback } from "react";
import { deleteUser } from "@/utils/admin";
import { toast } from "sonner";
import { User } from "@/hooks/useUserManagement";

export function useUserDelete(onSuccess: () => void) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle delete user with improved error handling and UI updates
  const handleDeleteUser = useCallback(async () => {
    if (!userToDelete) {
      toast.error("No user selected for deletion");
      setIsDeleteDialogOpen(false);
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Attempting to delete user:", userToDelete.email);
      
      // Store user info before API call
      const firstName = userToDelete.first_name || '';
      const lastName = userToDelete.last_name || '';
      const email = userToDelete.email || '';
      const userId = userToDelete.id;
      
      const result = await deleteUser(userId);
      
      // Close dialog immediately to improve UX
      setIsDeleteDialogOpen(false);
      
      if (result && result.success) {
        // Small delay before showing success toast and triggering refresh
        setTimeout(() => {
          if (result.alreadyDeleted) {
            toast.info(`User ${firstName} ${lastName} was already deleted`);
          } else {
            toast.success(`User ${firstName} ${lastName} deleted successfully`);
          }
          
          // Call onSuccess callback to refresh user list
          onSuccess();
        }, 300);
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Error deleting user");
    } finally {
      setUserToDelete(null);
      setIsSubmitting(false);
    }
  }, [userToDelete, onSuccess]);

  // Open delete user dialog with proper state handling
  const openDeleteUserDialog = useCallback((user: User) => {
    console.log("Opening delete dialog for user:", user.email);
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }, []);

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    isSubmitting,
    handleDeleteUser,
    openDeleteUserDialog
  };
}

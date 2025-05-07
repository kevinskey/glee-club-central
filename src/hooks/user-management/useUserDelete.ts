
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
      const userId = userToDelete.id;
      
      const result = await deleteUser(userId);
      
      // Close dialog immediately to improve UX
      setIsDeleteDialogOpen(false);
      
      if (result && result.success) {
        // Small delay before showing toast and triggering refresh
        setTimeout(() => {
          if (result.alreadyDeleted) {
            toast.info(`User ${firstName} ${lastName} was already deleted`);
          } else {
            toast.success(`User ${firstName} ${lastName} deleted successfully`);
          }
          
          // Reset state before calling onSuccess to prevent re-render issues
          setUserToDelete(null);
          // Call onSuccess callback to refresh user list
          onSuccess();
        }, 300);
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Error deleting user");
      setIsDeleteDialogOpen(false);
    } finally {
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

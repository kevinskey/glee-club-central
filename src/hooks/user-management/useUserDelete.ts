
import { useState } from "react";
import { deleteUser } from "@/utils/admin";
import { toast } from "sonner";
import { User } from "@/hooks/useUserManagement";

export function useUserDelete(onSuccess: () => void) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle delete user with improved error handling and UI updates
  const handleDeleteUser = async () => {
    if (!userToDelete) {
      toast.error("No user selected for deletion");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Attempting to delete user:", userToDelete.email);
      const result = await deleteUser(userToDelete.id);
      
      if (result && result.success) {
        // First close the dialog to prevent UI glitching
        setIsDeleteDialogOpen(false);
        
        // Clear user state
        setUserToDelete(null);
        
        // Add small delay before triggering data refresh to prevent UI glitches
        setTimeout(() => {
          toast.success(`User ${userToDelete.first_name} ${userToDelete.last_name} deleted successfully`);
          onSuccess();
        }, 200);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Error deleting user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete user dialog
  const openDeleteUserDialog = (user: User) => {
    console.log("Opening delete dialog for user:", user.email);
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

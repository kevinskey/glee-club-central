
import { useState } from "react";
import { updateUser } from "@/utils/admin";
import { toast } from "sonner";
import { User } from "@/hooks/useUserManagement";
import { UserFormValues } from "@/components/members/form/userFormSchema";

export function useUserEdit(selectedUser: User | null, onSuccess: () => void) {
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle edit user submission
  const handleEditUser = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (!selectedUser) {
        toast.error("No user selected for update");
        return;
      }
      
      console.log("Selected user:", selectedUser);
      
      // Update user data
      const updateData: any = {
        id: selectedUser.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        status: data.status,
        voice_part: data.voice_part,
        phone: data.phone,
      };
      
      // Add password only if provided
      if (data.password) {
        updateData.password = data.password;
      }
      
      console.log("Sending update with data:", updateData);
      
      const result = await updateUser(updateData);
      
      if (result.success) {
        toast.success(`User ${data.first_name} ${data.last_name} updated successfully`);
        await onSuccess(); // Refresh user list with await to ensure it completes
        setIsEditUserOpen(false);
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(`Update failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditUserOpen,
    setIsEditUserOpen,
    isSubmitting,
    handleEditUser
  };
}

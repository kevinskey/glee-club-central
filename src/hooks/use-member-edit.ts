
import { useState } from "react";
import { Profile } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/utils/supabase/users";
import { toast } from "sonner";

export interface EditMemberFormValues {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string | null;
  voice_part?: string | null;
  role: string;
  status: string;
  join_date?: string | null;
  class_year?: string | null;
  dues_paid?: boolean | null;
  notes?: string | null;
  special_roles?: string | null;
}

export function useMemberEdit() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const editMember = async (
    memberId: string, 
    formData: EditMemberFormValues,
    onSuccess?: (updatedMember: Partial<Profile>) => void
  ) => {
    setIsLoading(true);
    
    try {
      // Create profile update object
      const profileUpdate: Partial<Profile> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        voice_part: formData.voice_part as any,
        role: formData.role as any,
        status: formData.status as any,
        join_date: formData.join_date,
        class_year: formData.class_year,
        dues_paid: formData.dues_paid,
        notes: formData.notes,
        special_roles: formData.special_roles
      };
      
      // Update the profile in the database
      const success = await updateUserProfile(memberId, profileUpdate);
      
      if (success) {
        toast.success("Member updated successfully");
        
        // Call the onSuccess callback with the updated member data
        if (onSuccess) {
          onSuccess({
            id: memberId,
            ...profileUpdate
          });
        }
        
        return true;
      } else {
        toast.error("Failed to update member");
        return false;
      }
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast.error(`Update failed: ${error.message || "Unknown error"}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isEditing,
    setIsEditing,
    isLoading,
    editMember
  };
}

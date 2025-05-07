
import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Profile, VoicePart, MemberStatus, UserRole } from "@/contexts/AuthContext";
import { updateUser } from '@/utils/admin/userUpdate';
import { MemberEditForm } from "./form/MemberEditForm";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Profile | null;
  onUpdateMember: (member: Profile) => void;
}

export const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onUpdateMember,
}) => {
  const onSubmit = async (data: any) => {
    if (!member) return;
    
    try {
      // Use updateUser to update the user
      const updateData = {
        id: member.id,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        status: data.status,
        voice_part: data.voice_part,
        phone: data.phone
      };
      
      const result = await updateUser(updateData);
      
      if (result.success) {
        // Create updated member object for the UI
        const updatedMember: Profile = {
          ...member,
          first_name: data.first_name,
          last_name: data.last_name,
          email: member.email, // Keep the existing email
          phone: data.phone,
          voice_part: data.voice_part as VoicePart,
          role: data.role as UserRole,
          status: data.status as MemberStatus,
        };
        
        // Pass the updated member to the parent component
        onUpdateMember(updatedMember);
        
        toast.success("Member updated successfully");
        
        // Close the dialog
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update member");
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update information for {member?.first_name} {member?.last_name}.
          </DialogDescription>
        </DialogHeader>
        <MemberEditForm 
          member={member}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

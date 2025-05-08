
import React, { useEffect, useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { MemberForm } from "@/components/members/MemberForm";
import { useMemberEdit } from "@/hooks/use-member-edit";
import { toast } from "sonner";
import { fetchUserById } from "@/utils/supabase/users";
import { User } from "@/hooks/useUserManagement";
import { EditMemberFormValues } from "@/hooks/use-member-edit";

interface EditMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string | null;
  onSuccess: () => void;
}

export function EditMemberDrawer({ 
  isOpen, 
  onClose, 
  memberId,
  onSuccess
}: EditMemberDrawerProps) {
  const [member, setMember] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { editMember, isLoading: isSaving } = useMemberEdit();
  
  // Fetch member details when drawer opens
  useEffect(() => {
    const getMember = async () => {
      if (isOpen && memberId) {
        setIsLoading(true);
        try {
          const data = await fetchUserById(memberId);
          setMember(data as User);
        } catch (error) {
          console.error("Error fetching member:", error);
          toast.error("Failed to load member details");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    getMember();
  }, [isOpen, memberId]);
  
  // Handle form submission
  const handleSubmit = async (data: EditMemberFormValues) => {
    if (!memberId) {
      toast.error("Member ID is missing");
      return;
    }
    
    try {
      await editMember(memberId, data);
      toast.success("Member updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Member</SheetTitle>
          <SheetDescription>
            Update member information and settings
          </SheetDescription>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : !member ? (
          <div className="py-8 text-center text-muted-foreground">
            Member not found or could not be loaded
          </div>
        ) : (
          <MemberForm 
            member={member}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

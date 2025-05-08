
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { fetchUserById } from "@/utils/supabase/users";
import { User } from "@/hooks/useUserManagement";
import { toast } from "sonner";

interface DeleteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string | null;
  onSuccess: () => void;
}

export function DeleteMemberDialog({
  isOpen,
  onClose,
  memberId,
  onSuccess
}: DeleteMemberDialogProps) {
  const [member, setMember] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch member details when dialog opens
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
  
  // Handle delete action
  const handleDelete = async () => {
    if (!memberId) {
      toast.error("Member ID is missing");
      return;
    }
    
    setIsDeleting(true);
    try {
      // This function will be implemented in the useMemberManagement hook
      // await deleteMember(memberId);
      toast.success("Member deleted successfully");
      onSuccess();
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Loading member details...</span>
              </div>
            ) : !member ? (
              "Could not load member details"
            ) : (
              <>
                This will permanently delete {member.first_name} {member.last_name}'s 
                account and all associated data. This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading || isDeleting || !member}
          >
            {isDeleting ? <Spinner size="sm" className="mr-2" /> : null}
            {isDeleting ? "Deleting..." : "Delete Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

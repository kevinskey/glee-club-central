
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/hooks/useUserManagement";

interface DeleteUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteConfirm: () => Promise<void>;
  isSubmitting?: boolean;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  user,
  isOpen,
  onOpenChange,
  onDeleteConfirm,
  isSubmitting = false,
}) => {
  // Handle delete confirmation with improved error handling
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    try {
      await onDeleteConfirm();
      // The dialog closing is now handled by the hook after successful deletion
    } catch (error) {
      console.error("Error in delete confirmation:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing dialog by user action during submission
      if (isSubmitting && !open) {
        return;
      }
      onOpenChange(open);
    }}>
      <DialogContent 
        className="z-50 bg-background sm:max-w-md w-[calc(100%-2rem)] p-4 sm:p-6"
        onInteractOutside={(e) => {
          // Prevent closing dialog by outside click during submission
          if (isSubmitting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing dialog by escape key during submission
          if (isSubmitting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user
            account and remove their data from our servers.
          </DialogDescription>
        </DialogHeader>
        {user && (
          <div className="flex items-center space-x-3 py-4">
            <Avatar>
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
              ) : (
                <AvatarFallback>
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{`${user.first_name || ''} ${user.last_name || ''}`}</p>
              <p className="text-sm text-muted-foreground">{user.email || 'No email available'}</p>
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => !isSubmitting && onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

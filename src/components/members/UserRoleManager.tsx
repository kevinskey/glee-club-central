
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, userManagementService } from '@/services/userManagement';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

interface UserRoleManagerProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void>;
}

export function UserRoleManager({
  user,
  isOpen,
  onOpenChange,
  onSuccess
}: UserRoleManagerProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | string>(user?.role || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset selected role when user changes
  useEffect(() => {
    if (user && isOpen) {
      setSelectedRole(user.role);
    }
  }, [user, isOpen]);
  
  const handleSave = async () => {
    if (!user || selectedRole === user.role) {
      onOpenChange(false);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await userManagementService.changeRole(user.id, selectedRole as string);
      
      if (success) {
        toast.success(`Updated ${user.first_name}'s role to ${selectedRole}`);
        onOpenChange(false);
        
        if (onSuccess) {
          await onSuccess();
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4">
              <Select
                value={selectedRole}
                onValueChange={(value: string) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="section_leader">Section Leader</SelectItem>
                  <SelectItem value="singer">Singer</SelectItem>
                  <SelectItem value="student_conductor">Student Conductor</SelectItem>
                  <SelectItem value="accompanist">Accompanist</SelectItem>
                  <SelectItem value="non_singer">Non-Singer</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="guest">Guest/Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting || selectedRole === user.role}
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

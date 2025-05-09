
import React, { useState } from 'react';
import { User, useUserManagement } from '@/hooks/useUserManagement';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

interface UserRoleSelectorProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserRoleSelector({
  user,
  isOpen,
  onOpenChange,
  onSuccess
}: UserRoleSelectorProps) {
  const { updateUserRole } = useUserManagement();
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || 'singer');
  const [isLoading, setIsLoading] = useState(false);

  const roles: { value: string; label: string }[] = [
    { value: "administrator", label: "Administrator" },
    { value: "section_leader", label: "Section Leader" },
    { value: "singer", label: "Singer" },
    { value: "student_conductor", label: "Student Conductor" },
    { value: "accompanist", label: "Accompanist" },
    { value: "non_singer", label: "Non-Singer" }
  ];

  React.useEffect(() => {
    if (user && isOpen) {
      setSelectedRole(user.role || 'singer');
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    if (!user || !selectedRole) {
      toast.error("Missing user or role");
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateUserRole(user.id, selectedRole);
      if (success) {
        toast.success(`Updated role for ${user.first_name} ${user.last_name}`);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            {user && `Update role for ${user.first_name} ${user.last_name}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select 
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

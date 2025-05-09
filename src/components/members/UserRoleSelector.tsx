
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User } from "@/hooks/useUserManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserRoleSelectorProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void>;
}

export function UserRoleSelector({
  user,
  isOpen,
  onOpenChange,
  onSuccess
}: UserRoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role || 'singer');
    }
  }, [user]);
  
  const roles = [
    { value: 'administrator', label: 'Administrator', description: 'Full access to all features' },
    { value: 'section_leader', label: 'Section Leader', description: 'Can manage section members and music' },
    { value: 'singer', label: 'Singer', description: 'Regular choir member' },
    { value: 'student_conductor', label: 'Student Conductor', description: 'Can lead rehearsals and access conductor tools' },
    { value: 'accompanist', label: 'Accompanist', description: 'Piano/instrumental support' },
    { value: 'non_singer', label: 'Non-Singer', description: 'Non-performing support role' }
  ];
  
  const handleSaveRole = async () => {
    if (!user || !selectedRole) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .rpc('handle_user_role', {
          p_user_id: user.id,
          p_role: selectedRole
        });
      
      if (error) throw error;
      
      toast.success(`Role updated to ${roles.find(r => r.value === selectedRole)?.label || selectedRole}`);
      
      if (onSuccess) {
        await onSuccess();
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(`Failed to update role: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Update role for {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        
        <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="gap-4">
          {roles.map((role) => (
            <div key={role.value} className="flex items-start space-x-2">
              <RadioGroupItem value={role.value} id={role.value} />
              <div className="grid gap-1">
                <Label htmlFor={role.value}>{role.label}</Label>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
        
        <Separator className="my-4" />
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveRole}
            disabled={isSaving || selectedRole === user.role}
          >
            {isSaving ? "Saving..." : "Save Role"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

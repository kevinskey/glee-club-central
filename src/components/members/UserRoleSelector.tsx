
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
  const [selectedRole, setSelectedRole] = useState<string>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (user) {
      // Set the role value
      setSelectedRole(user.role || 'general');
      setError(null);
    }
  }, [user]);
  
  // Define available roles
  const roles: { value: string; label: string; description: string }[] = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'administrator', label: 'Administrator', description: 'Full access to all features' },
    { value: 'director', label: 'Director', description: 'Administrative access with artistic oversight' },
    { value: 'general', label: 'General User', description: 'Regular member access' }
  ];
  
  const handleSaveRole = async () => {
    if (!user || !selectedRole) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      console.log("Saving role:", { userId: user.id, role: selectedRole });
      
      // Check that the role is valid before saving
      if (!roles.some(r => r.value === selectedRole)) {
        throw new Error(`Invalid role value: ${selectedRole}`);
      }
      
      // Direct update to the profiles table
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', user.id);
      
      if (updateError) {
        console.error("Update error details:", updateError);
        throw updateError;
      }
      
      console.log("Role update successful", data);
      const roleLabel = roles.find(r => r.value === selectedRole)?.label || selectedRole;
      toast.success(`Role updated to ${roleLabel}`);
      
      if (onSuccess) {
        await onSuccess();
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating role:', error);
      setError(`Failed to update role: ${error.message || 'Unknown error'}`);
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
        
        {error && (
          <div className="mb-4">
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          </div>
        )}
        
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

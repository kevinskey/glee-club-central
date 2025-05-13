
import React, { useState, useEffect } from 'react';
import { User } from '@/hooks/useUserManagement';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UserTitle } from '@/types/permissions';
import { updateUserTitle, toggleSuperAdmin } from '@/utils/supabase/permissions';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserTitleManagementProps {
  user: User | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserTitleManagement({ 
  user, 
  isOpen, 
  setIsOpen,
  onSuccess
}: UserTitleManagementProps) {
  const [selectedTitle, setSelectedTitle] = useState<UserTitle | null>(
    (user?.title as UserTitle) || null
  );
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(
    user?.is_super_admin || false
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // Update form state when user changes
  useEffect(() => {
    if (user) {
      setSelectedTitle((user.title as UserTitle) || "General Member");
      setIsSuperAdmin(user.is_super_admin || false);
    }
  }, [user]);

  // Make sure this array includes all UserTitle values
  const titles: UserTitle[] = [
    'Super Admin',
    'Treasurer',
    'Librarian',
    'Wardrobe Mistress',
    'Secretary',
    'President',
    'Historian',
    'PR Manager',
    'Tour Manager',
    'Stage Manager',
    'Chaplain',
    'Section Leader',
    'Student Worker',
    'General Member',
    'Assistant Director',
    'Director',
    'Administrator'
  ];

  const handleSave = async () => {
    if (!user || !selectedTitle) {
      toast.error("Missing user or title");
      return;
    }

    setIsLoading(true);
    try {
      // Update title using RPC function
      const titleUpdated = await updateUserTitle(user.id, selectedTitle);
      
      // Update admin status directly
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_super_admin: isSuperAdmin,
          title: selectedTitle
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("User role updated successfully");
      if (onSuccess) onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogDescription>
            {user && `Change role settings for ${user.first_name} ${user.last_name}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Select 
              value={selectedTitle || undefined}
              onValueChange={(value) => setSelectedTitle(value as UserTitle)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select user title" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {titles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="super-admin" className="text-right">
              Super Admin
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="super-admin"
                checked={isSuperAdmin}
                onCheckedChange={setIsSuperAdmin}
              />
              <Label htmlFor="super-admin" className="text-sm text-muted-foreground">
                {isSuperAdmin ? "Full access to all features" : "Access based on title permissions"}
              </Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
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

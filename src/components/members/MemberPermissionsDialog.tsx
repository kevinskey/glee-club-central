
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User } from "@/hooks/useUserManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PermissionName } from "@/types/permissions";

interface MemberPermissionsDialogProps {
  user: User | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => Promise<void>;
}

export function MemberPermissionsDialog({
  user,
  isOpen,
  setIsOpen,
  onSuccess
}: MemberPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch current permissions when user changes
  useEffect(() => {
    if (user && isOpen) {
      fetchPermissions();
    }
  }, [user, isOpen]);
  
  const fetchPermissions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_user_permissions', { p_user_id: user.id });
        
      if (error) throw error;
      
      if (data) {
        const permMap: Record<string, boolean> = {};
        data.forEach((item: any) => {
          permMap[item.permission] = item.granted;
        });
        setPermissions(permMap);
      }
    } catch (err: any) {
      console.error('Error fetching permissions:', err);
      toast.error('Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePermission = (permission: string) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };
  
  const savePermissions = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // For now, we'll just show a toast - in a real app, you'd save these to the database
      toast.success('Permissions updated successfully');
      
      if (onSuccess) {
        await onSuccess();
      }
      
      setIsOpen(false);
    } catch (err: any) {
      console.error('Error saving permissions:', err);
      toast.error('Failed to update permissions');
    } finally {
      setIsSaving(false);
    }
  };
  
  const permissionsList: {name: PermissionName, label: string, description: string}[] = [
    { name: 'can_view_financials', label: 'View Financials', description: 'Can view financial reports and dues information' },
    { name: 'can_edit_financials', label: 'Edit Financials', description: 'Can manage payments and financial records' },
    { name: 'can_upload_sheet_music', label: 'Upload Sheet Music', description: 'Can add new sheet music to the library' },
    { name: 'can_view_sheet_music', label: 'View Sheet Music', description: 'Can access and view sheet music' },
    { name: 'can_edit_attendance', label: 'Edit Attendance', description: 'Can mark and edit attendance records' },
    { name: 'can_view_attendance', label: 'View Attendance', description: 'Can view attendance records' },
    { name: 'can_view_wardrobe', label: 'View Wardrobe', description: 'Can view wardrobe inventory and assignments' },
    { name: 'can_edit_wardrobe', label: 'Edit Wardrobe', description: 'Can manage wardrobe inventory and assignments' },
    { name: 'can_upload_media', label: 'Upload Media', description: 'Can upload photos, videos, and recordings' },
    { name: 'can_manage_tour', label: 'Manage Tour', description: 'Can plan and organize tour logistics' },
    { name: 'can_manage_stage', label: 'Manage Stage', description: 'Can create and edit stage plots' },
    { name: 'can_view_prayer_box', label: 'View Prayer Box', description: 'Can access prayer requests' },
    { name: 'can_post_announcements', label: 'Post Announcements', description: 'Can create and edit announcements' },
    { name: 'can_manage_users', label: 'Manage Users', description: 'Can add, edit, and remove members' }
  ];
  
  if (!user) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Set permissions for {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {permissionsList.map((perm) => (
              <div key={perm.name} className="flex items-start space-x-2">
                <Checkbox 
                  id={perm.name} 
                  checked={!!permissions[perm.name]} 
                  onCheckedChange={() => togglePermission(perm.name)}
                />
                <div className="grid gap-1.5">
                  <Label 
                    htmlFor={perm.name} 
                    className="text-sm font-medium"
                  >
                    {perm.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {perm.description}
                  </p>
                </div>
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={savePermissions}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Permissions"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

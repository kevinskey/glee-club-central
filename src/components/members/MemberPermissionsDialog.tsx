
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionName } from '@/types/permissions';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Permission {
  permission: PermissionName;
  granted: boolean;
}

interface MemberPermissionsDialogProps {
  user: User | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MemberPermissionsDialog({
  user,
  isOpen,
  setIsOpen,
  onSuccess
}: MemberPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch permissions when dialog opens and user changes
  useEffect(() => {
    if (isOpen && user) {
      fetchUserPermissions();
    }
  }, [isOpen, user]);

  // Fetch user permissions from Supabase
  const fetchUserPermissions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_user_permissions', { p_user_id: user.id });

      if (error) {
        toast.error('Failed to load permissions');
        console.error('Error fetching permissions:', error);
        return;
      }

      setPermissions(data || []);
    } catch (error) {
      console.error('Error in fetchUserPermissions:', error);
      toast.error('An error occurred while fetching permissions');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle permission state
  const togglePermission = (permissionName: PermissionName) => {
    setPermissions(prevPermissions => 
      prevPermissions.map(p => 
        p.permission === permissionName 
          ? { ...p, granted: !p.granted } 
          : p
      )
    );
  };

  // Save updated permissions
  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // For each permission, update it in the database using the SQL function via direct SQL query
      let allSuccessful = true;
      
      for (const { permission, granted } of permissions) {
        // Get the user's title first
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('title')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error getting user title:', profileError);
          allSuccessful = false;
          continue;
        }
        
        const userTitle = profileData?.title;
        if (!userTitle) {
          console.error('User has no title assigned');
          allSuccessful = false;
          continue;
        }
        
        // Get the role ID for this title
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('id')
          .eq('title', userTitle)
          .single();
          
        if (roleError) {
          console.error('Error getting role ID:', roleError);
          allSuccessful = false;
          continue;
        }
        
        const roleId = roleData?.id;
        if (!roleId) {
          console.error('No role found for title:', userTitle);
          allSuccessful = false;
          continue;
        }
        
        // Check if permission exists for this role
        const { data: existingPerm, error: checkError } = await supabase
          .from('role_permissions')
          .select('id')
          .eq('role_id', roleId)
          .eq('permission', permission)
          .maybeSingle();
          
        if (checkError) {
          console.error('Error checking existing permission:', checkError);
          allSuccessful = false;
          continue;
        }
        
        let updateError;
        
        if (existingPerm) {
          // Update existing permission
          const { error } = await supabase
            .from('role_permissions')
            .update({ granted })
            .eq('id', existingPerm.id);
            
          updateError = error;
        } else {
          // Insert new permission
          const { error } = await supabase
            .from('role_permissions')
            .insert({ role_id: roleId, permission, granted });
            
          updateError = error;
        }
        
        if (updateError) {
          console.error(`Error updating permission ${permission}:`, updateError);
          allSuccessful = false;
        }
      }

      if (allSuccessful) {
        toast.success('Permissions updated successfully');
        if (onSuccess) onSuccess();
        setIsOpen(false);
      } else {
        toast.error('Some permissions failed to update');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  // Group permissions by category for better organization
  const contentPermissions = permissions.filter(p => 
    p.permission.includes('view') || p.permission.includes('edit') || p.permission.includes('upload')
  );
  
  const managementPermissions = permissions.filter(p => 
    p.permission.includes('manage')
  );
  
  const otherPermissions = permissions.filter(p => 
    !contentPermissions.includes(p) && !managementPermissions.includes(p)
  );

  // Helper function to format permission names for display
  const formatPermissionName = (name: string): string => {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            {user && `Set permissions for ${user.first_name} ${user.last_name}`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="content">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="content">Content Access</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              {contentPermissions.map(({ permission, granted }) => (
                <div key={permission} className="flex items-center justify-between">
                  <Label htmlFor={permission} className="flex-1">
                    {formatPermissionName(permission)}
                  </Label>
                  <Switch 
                    id={permission}
                    checked={granted}
                    onCheckedChange={() => togglePermission(permission as PermissionName)}
                  />
                </div>
              ))}
              {contentPermissions.length === 0 && (
                <p className="text-sm text-muted-foreground">No content permissions available.</p>
              )}
            </TabsContent>
            
            <TabsContent value="management" className="space-y-4">
              {managementPermissions.map(({ permission, granted }) => (
                <div key={permission} className="flex items-center justify-between">
                  <Label htmlFor={permission} className="flex-1">
                    {formatPermissionName(permission)}
                  </Label>
                  <Switch 
                    id={permission}
                    checked={granted}
                    onCheckedChange={() => togglePermission(permission as PermissionName)}
                  />
                </div>
              ))}
              {managementPermissions.length === 0 && (
                <p className="text-sm text-muted-foreground">No management permissions available.</p>
              )}
            </TabsContent>
            
            <TabsContent value="other" className="space-y-4">
              {otherPermissions.map(({ permission, granted }) => (
                <div key={permission} className="flex items-center justify-between">
                  <Label htmlFor={permission} className="flex-1">
                    {formatPermissionName(permission)}
                  </Label>
                  <Switch 
                    id={permission}
                    checked={granted}
                    onCheckedChange={() => togglePermission(permission as PermissionName)}
                  />
                </div>
              ))}
              {otherPermissions.length === 0 && (
                <p className="text-sm text-muted-foreground">No additional permissions available.</p>
              )}
            </TabsContent>
          </Tabs>
        )}

        <Separator className="my-4" />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Save Permissions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

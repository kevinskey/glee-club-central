import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Plus } from 'lucide-react';
import { useTitlesManagement } from '@/hooks/useTitlesManagement';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';
import { User } from '@/hooks/useUserManagement';

export function TitlePermissionsManager() {
  const { 
    titles,
    permissions,
    isLoading: titlesLoading,
    fetchTitlePermissions,
    updateTitlePermissions,
    addNewTitle
  } = useTitlesManagement();

  const { isSuperAdmin } = usePermissions();
  
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<any | null>(null);
  const [titlePermissions, setTitlePermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // New title form
  const [newTitleName, setNewTitleName] = useState('');
  const [newTitleDescription, setNewTitleDescription] = useState('');
  const [addingTitle, setAddingTitle] = useState(false);
  
  // Load title permissions when a title is selected
  useEffect(() => {
    if (selectedTitleId) {
      loadTitlePermissions(selectedTitleId);
    }
  }, [selectedTitleId]);
  
  const loadTitlePermissions = async (titleId: string) => {
    setLoading(true);
    try {
      const data = await fetchTitlePermissions(titleId);
      
      // Find the selected title object
      const title = titles.find(t => t.id === titleId);
      setSelectedTitle(title || null);
      
      // Convert to a simple permission map
      const permMap: Record<string, boolean> = {};
      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          if (item && item.permission_id && permissions) {
            // Find the permission name from the permission ID
            const permission = permissions.find(p => p.id === item.permission_id);
            if (permission) {
              permMap[permission.name] = item.granted;
            }
          }
        });
      }
      
      // Ensure all permissions have an entry in the map
      if (permissions) {
        permissions.forEach(perm => {
          if (!(perm.name in permMap)) {
            permMap[perm.name] = false;
          }
        });
      }
      
      setTitlePermissions(permMap);
    } catch (err) {
      console.error('Error loading title permissions:', err);
      toast.error('Failed to load title permissions');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTogglePermission = (permissionName: string) => {
    setTitlePermissions(prev => ({
      ...prev,
      [permissionName]: !prev[permissionName]
    }));
  };
  
  const handleSavePermissions = async () => {
    if (!selectedTitleId) return;
    
    setSaving(true);
    try {
      // Convert permission map to array of updates
      const permissionUpdates = permissions.map(perm => ({
        permissionId: perm.id,
        granted: titlePermissions[perm.name] || false
      }));
      
      const success = await updateTitlePermissions(selectedTitleId, permissionUpdates);
      if (success) {
        toast.success('Title permissions updated');
      }
    } catch (err) {
      console.error('Error saving title permissions:', err);
      toast.error('Failed to save title permissions');
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddTitle = async () => {
    if (!newTitleName.trim()) {
      toast.error('Title name is required');
      return;
    }
    
    setAddingTitle(true);
    try {
      const success = await addNewTitle(newTitleName.trim(), newTitleDescription.trim() || undefined);
      if (success) {
        setNewTitleName('');
        setNewTitleDescription('');
      }
    } catch (err) {
      console.error('Error adding new title:', err);
      toast.error('Failed to add new title');
    } finally {
      setAddingTitle(false);
    }
  };
  
  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Title Permissions Management</CardTitle>
          <CardDescription>
            You need super admin privileges to manage title permissions
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New User Title</CardTitle>
          <CardDescription>
            Create a new role with custom permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title-name">Title Name</Label>
                <Input 
                  id="title-name" 
                  value={newTitleName} 
                  onChange={(e) => setNewTitleName(e.target.value)} 
                  placeholder="e.g., Choir Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title-desc">Description (Optional)</Label>
                <Input 
                  id="title-desc" 
                  value={newTitleDescription} 
                  onChange={(e) => setNewTitleDescription(e.target.value)} 
                  placeholder="Describe role responsibilities"
                />
              </div>
            </div>
            <Button 
              onClick={handleAddTitle}
              disabled={addingTitle || !newTitleName.trim()}
              className="w-full sm:w-auto"
            >
              {addingTitle ? <Spinner size="sm" className="mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
              Add Title
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Title Permissions</CardTitle>
          <CardDescription>
            Manage what each user title can access in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="select-title">Select Title to Manage</Label>
              {titlesLoading ? (
                <div className="flex items-center space-x-2 py-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-muted-foreground">Loading titles...</span>
                </div>
              ) : (
                <Select
                  value={selectedTitleId || undefined}
                  onValueChange={setSelectedTitleId}
                >
                  <SelectTrigger id="select-title" className="w-full sm:w-[300px]">
                    <SelectValue placeholder="Select a title to manage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {titles.map(title => (
                        <SelectItem key={title.id} value={title.id}>
                          {title.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {selectedTitleId && (
              <div className="space-y-4 pt-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedTitle?.name}</h3>
                  {selectedTitle?.description && (
                    <p className="text-muted-foreground text-sm">{selectedTitle.description}</p>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <div className="space-y-4 border rounded-md p-4">
                    <h4 className="font-medium">Permissions</h4>
                    <div className="grid gap-3">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-start space-x-3">
                          <Checkbox 
                            id={permission.id} 
                            checked={titlePermissions[permission.name] || false} 
                            onCheckedChange={() => handleTogglePermission(permission.name)}
                          />
                          <div className="space-y-1">
                            <Label htmlFor={permission.id} className="font-medium">
                              {permission.name}
                            </Label>
                            {permission.description && (
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        {selectedTitleId && !loading && (
          <CardFooter className="justify-end">
            <Button 
              onClick={handleSavePermissions}
              disabled={saving}
            >
              {saving ? <Spinner size="sm" className="mr-2" /> : null}
              Save Permissions
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

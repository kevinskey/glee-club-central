
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useUserManagement } from '@/hooks/user/useUserManagement';
import { AVAILABLE_FEATURES, AVAILABLE_PAGES, FeaturePermission, PagePermission } from '@/hooks/useFeaturePermissions';
import { Shield, User, Users, Settings, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function PermissionManagement() {
  const { users } = useUserManagement();
  const [featurePermissions, setFeaturePermissions] = useState<FeaturePermission[]>([]);
  const [pagePermissions, setPagePermissions] = useState<PagePermission[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedFeature, setSelectedFeature] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<string>('');

  const availableRoles = [
    'President', 'Secretary', 'Treasurer', 'Historian', 
    'Social Chair', 'Librarian', 'Chaplain'
  ];

  const fetchPermissions = async () => {
    try {
      const [featuresResponse, pagesResponse] = await Promise.all([
        supabase.from('feature_permissions').select('*').order('created_at', { ascending: false }),
        supabase.from('page_permissions').select('*').order('created_at', { ascending: false })
      ]);

      if (featuresResponse.error) throw featuresResponse.error;
      if (pagesResponse.error) throw pagesResponse.error;

      setFeaturePermissions(featuresResponse.data || []);
      setPagePermissions(pagesResponse.data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const addFeaturePermission = async (featureKey: string, userId?: string, roleTag?: string, enabled: boolean = true) => {
    try {
      const { error } = await supabase
        .from('feature_permissions')
        .insert({
          feature_key: featureKey,
          user_id: userId || null,
          role_tag: roleTag || null,
          enabled
        });

      if (error) throw error;
      
      toast.success('Feature permission added');
      fetchPermissions();
    } catch (error) {
      console.error('Error adding feature permission:', error);
      toast.error('Failed to add feature permission');
    }
  };

  const addPagePermission = async (pagePath: string, userId?: string, roleTag?: string, enabled: boolean = true) => {
    try {
      const { error } = await supabase
        .from('page_permissions')
        .insert({
          page_path: pagePath,
          user_id: userId || null,
          role_tag: roleTag || null,
          enabled
        });

      if (error) throw error;
      
      toast.success('Page permission added');
      fetchPermissions();
    } catch (error) {
      console.error('Error adding page permission:', error);
      toast.error('Failed to add page permission');
    }
  };

  const toggleFeaturePermission = async (permissionId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_permissions')
        .update({ enabled })
        .eq('id', permissionId);

      if (error) throw error;
      
      setFeaturePermissions(prev => 
        prev.map(p => p.id === permissionId ? { ...p, enabled } : p)
      );
      toast.success('Feature permission updated');
    } catch (error) {
      console.error('Error updating feature permission:', error);
      toast.error('Failed to update feature permission');
    }
  };

  const togglePagePermission = async (permissionId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('page_permissions')
        .update({ enabled })
        .eq('id', permissionId);

      if (error) throw error;
      
      setPagePermissions(prev => 
        prev.map(p => p.id === permissionId ? { ...p, enabled } : p)
      );
      toast.success('Page permission updated');
    } catch (error) {
      console.error('Error updating page permission:', error);
      toast.error('Failed to update page permission');
    }
  };

  const deleteFeaturePermission = async (permissionId: string) => {
    try {
      const { error } = await supabase
        .from('feature_permissions')
        .delete()
        .eq('id', permissionId);

      if (error) throw error;
      
      setFeaturePermissions(prev => prev.filter(p => p.id !== permissionId));
      toast.success('Feature permission deleted');
    } catch (error) {
      console.error('Error deleting feature permission:', error);
      toast.error('Failed to delete feature permission');
    }
  };

  const deletePagePermission = async (permissionId: string) => {
    try {
      const { error } = await supabase
        .from('page_permissions')
        .delete()
        .eq('id', permissionId);

      if (error) throw error;
      
      setPagePermissions(prev => prev.filter(p => p.id !== permissionId));
      toast.success('Page permission deleted');
    } catch (error) {
      console.error('Error deleting page permission:', error);
      toast.error('Failed to delete page permission');
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-navy-900">Permission Management</h2>
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">Feature Permissions</TabsTrigger>
          <TabsTrigger value="pages">Page Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          {/* Add Feature Permission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Feature Permission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Feature</Label>
                  <Select value={selectedFeature} onValueChange={setSelectedFeature}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feature" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_FEATURES.map(feature => (
                        <SelectItem key={feature.key} value={feature.key}>
                          {feature.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>User (Optional)</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific user</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Role (Optional)</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific role</SelectItem>
                      {availableRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      if (selectedFeature) {
                        addFeaturePermission(
                          selectedFeature, 
                          selectedUser || undefined, 
                          selectedRole || undefined
                        );
                        setSelectedFeature('');
                        setSelectedUser('');
                        setSelectedRole('');
                      }
                    }}
                    disabled={!selectedFeature}
                  >
                    Add Permission
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Permissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Feature Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featurePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {AVAILABLE_FEATURES.find(f => f.key === permission.feature_key)?.label || permission.feature_key}
                        </Badge>
                        {permission.user_id && (
                          <Badge variant="secondary">
                            <User className="w-3 h-3 mr-1" />
                            {getUserName(permission.user_id)}
                          </Badge>
                        )}
                        {permission.role_tag && (
                          <Badge variant="default">
                            <Users className="w-3 h-3 mr-1" />
                            {permission.role_tag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {AVAILABLE_FEATURES.find(f => f.key === permission.feature_key)?.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={permission.enabled}
                        onCheckedChange={(enabled) => toggleFeaturePermission(permission.id, enabled)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFeaturePermission(permission.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          {/* Add Page Permission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Page Permission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Page</Label>
                  <Select value={selectedPage} onValueChange={setSelectedPage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_PAGES.map(page => (
                        <SelectItem key={page.path} value={page.path}>
                          {page.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>User (Optional)</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific user</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Role (Optional)</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific role</SelectItem>
                      {availableRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      if (selectedPage) {
                        addPagePermission(
                          selectedPage, 
                          selectedUser || undefined, 
                          selectedRole || undefined
                        );
                        setSelectedPage('');
                        setSelectedUser('');
                        setSelectedRole('');
                      }
                    }}
                    disabled={!selectedPage}
                  >
                    Add Permission
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Page Permissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Page Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pagePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {AVAILABLE_PAGES.find(p => p.path === permission.page_path)?.label || permission.page_path}
                        </Badge>
                        {permission.user_id && (
                          <Badge variant="secondary">
                            <User className="w-3 h-3 mr-1" />
                            {getUserName(permission.user_id)}
                          </Badge>
                        )}
                        {permission.role_tag && (
                          <Badge variant="default">
                            <Users className="w-3 h-3 mr-1" />
                            {permission.role_tag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {AVAILABLE_PAGES.find(p => p.path === permission.page_path)?.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={permission.enabled}
                        onCheckedChange={(enabled) => togglePagePermission(permission.id, enabled)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePagePermission(permission.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

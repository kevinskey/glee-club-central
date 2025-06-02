
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Save, X, User, Tags } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getAllRoles } from '@/utils/permissionsMap';

interface UserSearchResult {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_tags: string[];
}

export function EditRoleTagsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [availableRoles] = useState(getAllRoles());
  const [selectedRoleTags, setSelectedRoleTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role_tags')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .order('last_name', { ascending: true });

      if (profileError) throw profileError;

      // Get emails from auth.users for matching profiles
      const userIds = profiles?.map(p => p.id) || [];
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Could not fetch user emails:', authError);
      }

      const usersWithEmails: UserSearchResult[] = profiles?.map(profile => {
        const authUser = authUsers?.users?.find(u => u.id === profile.id);
        return {
          id: profile.id,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: authUser?.email || 'No email',
          role_tags: profile.role_tags || []
        };
      }) || [];

      // Also search by email if we have auth access
      const emailMatches: UserSearchResult[] = authUsers?.users
        ?.filter(user => user.email?.toLowerCase().includes(query.toLowerCase()))
        .map(user => {
          const profile = profiles?.find(p => p.id === user.id);
          if (profile) {
            return {
              id: profile.id,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              email: user.email || 'No email',
              role_tags: profile.role_tags || []
            };
          }
          return null;
        })
        .filter((user): user is UserSearchResult => user !== null) || [];

      // Combine and deduplicate results
      const allResults = [...usersWithEmails, ...emailMatches].filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      );

      setSearchResults(allResults);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const selectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setSelectedRoleTags(user.role_tags || []);
    setSearchResults([]);
    setSearchQuery('');
  };

  const toggleRoleTag = (roleTag: string, checked: boolean) => {
    if (checked) {
      setSelectedRoleTags(prev => [...prev, roleTag]);
    } else {
      setSelectedRoleTags(prev => prev.filter(tag => tag !== roleTag));
    }
  };

  const saveChanges = async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role_tags: selectedRoleTags,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update the selected user's role tags locally
      setSelectedUser(prev => prev ? { ...prev, role_tags: selectedRoleTags } : null);
      
      toast.success(`Role tags updated for ${selectedUser.first_name} ${selectedUser.last_name}`);
    } catch (error) {
      console.error('Error updating role tags:', error);
      toast.error('Failed to update role tags');
    } finally {
      setIsSaving(false);
    }
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setSelectedRoleTags([]);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Tags className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle>Edit Role Tags</CardTitle>
            <CardDescription>
              Search for users and manage their executive board role assignments
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-lg max-h-40 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  onClick={() => selectUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {user.role_tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isSearching && (
            <p className="text-sm text-muted-foreground">Searching...</p>
          )}
        </div>

        {/* Selected User Section */}
        {selectedUser && (
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Role Tags Editor */}
            <div className="space-y-4">
              <h4 className="font-medium">Executive Board Roles</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableRoles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role}`}
                      checked={selectedRoleTags.includes(role)}
                      onCheckedChange={(checked) => toggleRoleTag(role, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`role-${role}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {role}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Current Tags Display */}
              {selectedRoleTags.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Current Role Tags:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoleTags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={saveChanges} 
                  disabled={isSaving}
                  className="bg-glee-purple hover:bg-glee-purple/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedUser && searchResults.length === 0 && !searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            <Tags className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Search for a user to edit their role tags</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

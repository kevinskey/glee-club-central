
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Search, 
  UserPlus, 
  AlertTriangle,
  Database,
  Edit
} from 'lucide-react';
import { useSimpleAuthContextFixed } from '@/contexts/SimpleAuthContextFixed';
import { useUsersSimplified } from '@/hooks/user/useUsersSimplified';
import { toast } from 'sonner';

export function UserManagementSimplified() {
  const { isAuthenticated, isLoading, isAdmin, user } = useSimpleAuthContextFixed();
  const { users, isLoading: usersLoading, error, refreshUsers } = useUsersSimplified();
  const [searchTerm, setSearchTerm] = useState('');

  const isAdminUser = isAdmin();

  useEffect(() => {
    console.log('🔍 UserManagementSimplified: Component state:', {
      isAuthenticated,
      isLoading,
      isAdminUser,
      userEmail: user?.email,
      usersLoading,
      error,
      usersCount: users.length
    });
  }, [isAuthenticated, isLoading, isAdminUser, user?.email, usersLoading, error, users.length]);

  // Auto-refresh users when component mounts and when authenticated
  useEffect(() => {
    if (isAuthenticated && isAdminUser) {
      refreshUsers();
    }
  }, [isAuthenticated, isAdminUser, refreshUsers]);

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    return fullName.includes(searchTermLower) || email.includes(searchTermLower);
  });

  const handleEditUser = (member: any) => {
    console.log('Edit user:', member);
    toast.info(`Edit functionality for ${member.first_name} ${member.last_name} coming soon`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading user management...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to access user management.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdminUser) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access user management. Admin access required.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage members and their information
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Database error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members ({filteredUsers.length})
            {usersLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading members...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {error ? 'Unable to Load Members' : 'No Members Found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {error 
                  ? 'There was an issue connecting to the database.' 
                  : searchTerm 
                    ? 'No members match your search criteria.' 
                    : 'No members have been added yet.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {member.first_name} {member.last_name}
                      </h3>
                      {member.email && (
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      )}
                      {member.voice_part && (
                        <p className="text-sm text-muted-foreground">
                          Voice Part: {member.voice_part}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(member)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {member.role && (
                        <Badge variant={member.role === 'admin' ? 'destructive' : 'outline'}>
                          {member.role}
                        </Badge>
                      )}
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status || 'active'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

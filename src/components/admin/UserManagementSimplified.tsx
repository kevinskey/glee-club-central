
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  UserPlus, 
  RefreshCw,
  AlertCircle,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { useUsersSimplified } from '@/hooks/user/useUsersSimplified';
import { User } from '@/hooks/user/types';
import { toast } from 'sonner';

export function UserManagementSimplified() {
  const { isAuthenticated, isLoading, isAdmin, user } = useSimpleAuthContext();
  const { fetchUsers, isLoading: usersLoading, error } = useUsersSimplified();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const isAdminUser = isAdmin ? isAdmin() : false;

  console.log('🔍 UserManagementSimplified: Component state:', {
    isAuthenticated,
    isLoading,
    isAdminUser,
    userEmail: user?.email,
    usersLoading,
    error,
    usersCount: users.length
  });

  const loadUsers = async () => {
    console.log('🔄 UserManagementSimplified: Loading users...');
    try {
      const fetchedUsers = await fetchUsers();
      if (fetchedUsers) {
        console.log('✅ UserManagementSimplified: Users loaded successfully:', fetchedUsers.length);
        setUsers(fetchedUsers);
        toast.success(`Loaded ${fetchedUsers.length} users successfully`);
      } else {
        console.warn('⚠️ UserManagementSimplified: No users returned from fetchUsers');
        toast.warning('No users found');
      }
    } catch (err) {
      console.error('❌ UserManagementSimplified: Error loading users:', err);
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdminUser) {
      console.log('🚀 UserManagementSimplified: Auto-loading users on mount');
      loadUsers();
    }
  }, [isAuthenticated, isAdminUser]);

  const filteredMembers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTermLower) || (user.email || '').toLowerCase().includes(searchTermLower);
  });

  if (isLoading || usersLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user management...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground">Please sign in to access user management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-muted-foreground">You need admin privileges to view this page.</p>
            <p className="text-sm text-muted-foreground mt-2">Current user: {user?.email}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage choir members</p>
        </div>

        <Card className="border-destructive/50">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-destructive">Failed to Load Users</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={loadUsers} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <p className="text-xs text-muted-foreground">
                If this persists, check browser console for details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage choir members and their information</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadUsers} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Members Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No members match your search criteria.' : 'No members have been loaded yet.'}
            </p>
            {!searchTerm && (
              <Button onClick={loadUsers} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Load Members
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Members ({filteredMembers.length})</h2>
            <Badge variant="outline">{users.length} total users</Badge>
          </div>
          
          <div className="grid gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>
                          {`${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {member.first_name} {member.last_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {member.email}
                          </div>
                          {member.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.is_super_admin && (
                        <Badge variant="destructive">
                          <Shield className="mr-1 h-3 w-3" />
                          Super Admin
                        </Badge>
                      )}
                      {member.role && (
                        <Badge variant={member.role === 'admin' ? 'destructive' : 'secondary'}>
                          {member.role}
                        </Badge>
                      )}
                      {member.voice_part && (
                        <Badge variant="outline">
                          {member.voice_part}
                        </Badge>
                      )}
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

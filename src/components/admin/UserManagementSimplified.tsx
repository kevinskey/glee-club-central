
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone,
  Music,
  RefreshCw
} from 'lucide-react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { useUsersSimplified } from '@/hooks/user/useUsersSimplified';
import { User } from '@/hooks/user/types';

export function UserManagementSimplified() {
  const { isAuthenticated, isLoading, isAdmin } = useSimpleAuthContext();
  const { fetchUsers, isLoading: usersLoading, error } = useUsersSimplified();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoicePart, setSelectedVoicePart] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  const isAdminUser = isAdmin ? isAdmin() : false;

  const loadUsers = async () => {
    const fetchedUsers = await fetchUsers();
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const filteredMembers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTermLower) || (user.email || '').toLowerCase().includes(searchTermLower);

    const matchesVoicePart = selectedVoicePart === 'all' || user.voice_part === selectedVoicePart;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    return matchesSearch && matchesVoicePart && matchesRole;
  });

  if (isLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You must be logged in to view member information.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Error Loading Members</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadUsers} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage choir members and their information
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadUsers} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {isAdminUser && (
            <Button variant="default">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>
      </div>

      {/* Search and filter controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedVoicePart} onValueChange={setSelectedVoicePart}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Voice Part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Voice Parts</SelectItem>
                  <SelectItem value="soprano_1">Soprano 1</SelectItem>
                  <SelectItem value="soprano_2">Soprano 2</SelectItem>
                  <SelectItem value="alto_1">Alto 1</SelectItem>
                  <SelectItem value="alto_2">Alto 2</SelectItem>
                  <SelectItem value="tenor">Tenor</SelectItem>
                  <SelectItem value="bass">Bass</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member List */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Members Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedVoicePart !== 'all' || selectedRole !== 'all' 
                ? 'No members match your search criteria.' 
                : 'No members have been added yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>
                        {`${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {member.first_name} {member.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {member.email}
                      </p>
                      {member.phone && (
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {member.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.role && (
                      <Badge variant={member.role === 'admin' ? 'destructive' : 'outline'}>
                        {member.role}
                      </Badge>
                    )}
                    {member.voice_part && (
                      <Badge variant="outline">
                        <Music className="mr-1 h-3 w-3" />
                        {member.voice_part}
                      </Badge>
                    )}
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                    {isAdminUser && (
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

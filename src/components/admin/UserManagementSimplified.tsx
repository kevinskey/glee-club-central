
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
  RefreshCw,
  AlertCircle,
  Database,
  CheckCircle,
  Filter
} from 'lucide-react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { useUsersSimplified } from '@/hooks/user/useUsersSimplified';
import { User } from '@/hooks/user/types';
import { DatabaseConnectionTest } from './DatabaseConnectionTest';

export function UserManagementSimplified() {
  const { isAuthenticated, isLoading, isAdmin } = useSimpleAuthContext();
  const { fetchUsers, isLoading: usersLoading, error } = useUsersSimplified();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoicePart, setSelectedVoicePart] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showDatabaseTest, setShowDatabaseTest] = useState(false);

  const isAdminUser = isAdmin ? isAdmin() : false;

  const loadUsers = async () => {
    const fetchedUsers = await fetchUsers();
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdminUser) {
      loadUsers();
    }
  }, [isAuthenticated, isAdminUser]);

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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Loading Members</h3>
                <p className="text-muted-foreground">Please wait while we fetch the member data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Access Restricted</h3>
                <p className="text-muted-foreground mb-6">
                  You must be logged in to view member information.
                </p>
                <Button>Sign In</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Admin Access Required</h3>
                <p className="text-muted-foreground">
                  You need administrator privileges to view this page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage choir members and their information
              </p>
            </div>
          </div>

          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-destructive">Error Loading Members</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={loadUsers} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => setShowDatabaseTest(!showDatabaseTest)} 
                  variant="secondary"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Database Test
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {showDatabaseTest && <DatabaseConnectionTest />}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage choir members and their information
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadUsers} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button 
              onClick={() => setShowDatabaseTest(!showDatabaseTest)} 
              variant="outline" 
              size="sm"
            >
              <Database className="mr-2 h-4 w-4" />
              DB Test
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Database Test */}
        {showDatabaseTest && <DatabaseConnectionTest />}

        {/* Success message */}
        {users.length > 0 && !error && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  Successfully connected! Loaded {users.length} members.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and filters */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Search & Filter</CardTitle>
            <CardDescription>
              Find and filter members by name, email, voice part, or role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedVoicePart} onValueChange={setSelectedVoicePart}>
                  <SelectTrigger className="w-[160px]">
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
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Filter summary */}
            {(searchTerm || selectedVoicePart !== 'all' || selectedRole !== 'all') && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing {filteredMembers.length} of {users.length} members</span>
                {searchTerm && <Badge variant="secondary">"{searchTerm}"</Badge>}
                {selectedVoicePart !== 'all' && <Badge variant="secondary">{selectedVoicePart}</Badge>}
                {selectedRole !== 'all' && <Badge variant="secondary">{selectedRole}</Badge>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Members list */}
        {filteredMembers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-3">No Members Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || selectedVoicePart !== 'all' || selectedRole !== 'all' 
                  ? 'No members match your current search and filter criteria. Try adjusting your filters or search terms.' 
                  : 'No members have been added to the system yet. Get started by adding your first member.'}
              </p>
              {!searchTerm && selectedVoicePart === 'all' && selectedRole === 'all' && (
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Your First Member
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Members ({filteredMembers.length})
              </h2>
            </div>
            
            <div className="grid gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {`${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">
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
                      <div className="flex items-center space-x-3">
                        {member.role && (
                          <Badge variant={member.role === 'admin' ? 'destructive' : 'outline'}>
                            {member.role}
                          </Badge>
                        )}
                        {member.voice_part && (
                          <Badge variant="secondary">
                            <Music className="mr-1 h-3 w-3" />
                            {member.voice_part}
                          </Badge>
                        )}
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone,
  Calendar,
  Music,
  Settings as SettingsIcon,
  Download,
  Upload
} from 'lucide-react';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { useUserManagement } from '@/hooks/user/useUserManagement';
import { CreateUserModal } from './CreateUserModal';
import { MemberCSVUpload } from './MemberCSVUpload';
import { MemberCSVDownload } from './MemberCSVDownload';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  voice_part: string;
  status: string;
  join_date: string;
  avatar_url?: string;
  phone?: string;
  class_year?: string;
}

export function MembersPageRefactor() {
  const { isAdmin, isLoading, isAuthenticated, profile } = useAuthMigration();
  const { users, isLoading: usersLoading, refreshUsers } = useUserManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoicePart, setSelectedVoicePart] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdminUser = isAdmin();

  useEffect(() => {
    if (isAuthenticated) {
      refreshUsers();
    }
  }, [isAuthenticated, refreshUsers]);

  const filteredMembers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTermLower) || (user.email || '').toLowerCase().includes(searchTermLower);

    const matchesVoicePart = selectedVoicePart === 'all' || user.voice_part === selectedVoicePart;

    return matchesSearch && matchesVoicePart;
  });

  const handleUserCreated = () => {
    refreshUsers();
  };

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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">
            Manage choir members and their information
          </p>
        </div>
        {isAdminUser && (
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        )}
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
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Member List</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
          <TabsTrigger value="upload">Batch Upload</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {filteredMembers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Members Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No members match your search criteria.' : 'No members have been added yet.'}
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
        </TabsContent>

        <TabsContent value="create">
          {isAdminUser ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Individual User</CardTitle>
                <CardDescription>
                  Add a single new member to the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowCreateModal(true)} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Open Create User Form
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Admin access required to create users.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload">
          {isAdminUser ? (
            <MemberCSVUpload />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Admin access required for batch uploads.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export">
          <MemberCSVDownload />
        </TabsContent>
      </Tabs>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}

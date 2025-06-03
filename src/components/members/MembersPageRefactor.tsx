
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Upload,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { useUserManagement, User } from '@/hooks/user/useUserManagement';
import { useUserUpdate } from '@/hooks/user/useUserUpdate';
import { CreateUserModal } from './CreateUserModal';
import { AddMemberDialog } from './AddMemberDialog';
import { EditUserDialog } from './EditUserDialog';
import { MemberCSVUpload } from './MemberCSVUpload';
import { MemberCSVDownload } from './MemberCSVDownload';
import { UserFormValues } from './form/userFormSchema';
import { useUserCreate } from '@/hooks/user/useUserCreate';
import { toast } from 'sonner';

export function MembersPageRefactor() {
  const { isAdmin, isLoading: authLoading, isAuthenticated, profile } = useAuthMigration();
  const { users, isLoading: usersLoading, error, refreshUsers } = useUserManagement();
  const { addUser } = useUserCreate();
  const { updateUser } = useUserUpdate(refreshUsers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoicePart, setSelectedVoicePart] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdminUser = isAdmin();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 MembersPageRefactor: User authenticated, fetching users...');
      refreshUsers();
    }
  }, [isAuthenticated, refreshUsers]);

  // Debug logging
  useEffect(() => {
    console.log('🏠 MembersPageRefactor state:', {
      isAuthenticated,
      authLoading,
      usersLoading,
      usersCount: users.length,
      error,
      isAdminUser
    });
  }, [isAuthenticated, authLoading, usersLoading, users.length, error, isAdminUser]);

  const filteredMembers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTermLower) || (user.email || '').toLowerCase().includes(searchTermLower);

    const matchesVoicePart = selectedVoicePart === 'all' || user.voice_part === selectedVoicePart;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    return matchesSearch && matchesVoicePart && matchesRole;
  });

  const handleUserCreated = () => {
    refreshUsers();
  };

  const handleAddMember = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setShowAddMemberDialog(false);
        refreshUsers();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleUserCardClick = (user: User) => {
    if (isAdminUser) {
      handleEditUser(user);
    }
  };

  const handleSaveUser = async (data: UserFormValues) => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      // Convert form data to User update format
      const updateData: Partial<User> = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        voice_part: data.voice_part,
        status: data.status,
        class_year: data.class_year,
        notes: data.notes,
        dues_paid: data.dues_paid,
        is_super_admin: data.is_admin,
        role: data.is_admin ? 'admin' : 'member'
      };

      const success = await updateUser(selectedUser.id, updateData);
      if (success) {
        setShowEditDialog(false);
        setSelectedUser(null);
        toast.success('User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    await refreshUsers();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading authentication...</p>
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
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={usersLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {isAdminUser && (
            <>
              <Button onClick={() => setShowAddMemberDialog(true)} variant="default">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
              <Button onClick={() => setShowCreateModal(true)} variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Quick Add
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading members: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {usersLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading members...</p>
          </CardContent>
        </Card>
      )}

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs">
            <p>Users loaded: {users.length}</p>
            <p>Filtered: {filteredMembers.length}</p>
            <p>Auth: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>Admin: {isAdminUser ? 'Yes' : 'No'}</p>
            <p>Loading: {usersLoading ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!usersLoading && (
        <>
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
              <TabsTrigger value="list">Member List ({filteredMembers.length})</TabsTrigger>
              <TabsTrigger value="create">Create User</TabsTrigger>
              <TabsTrigger value="upload">Batch Upload</TabsTrigger>
              <TabsTrigger value="export">Export Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              {filteredMembers.length === 0 && !usersLoading ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Members Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {users.length === 0 
                        ? 'No members have been added yet.' 
                        : 'No members match your search criteria.'
                      }
                    </p>
                    {isAdminUser && users.length === 0 && (
                      <Button onClick={() => setShowAddMemberDialog(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Your First Member
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredMembers.map((member) => (
                    <Card 
                      key={member.id} 
                      className={`transition-all duration-200 ${
                        isAdminUser 
                          ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] hover:border-primary/50' 
                          : ''
                      }`}
                      onClick={() => handleUserCardClick(member)}
                    >
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
                                {member.email || 'No email'}
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
                                {member.voice_part.replace('_', ' ')}
                              </Badge>
                            )}
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                              {member.status || 'active'}
                            </Badge>
                            {isAdminUser && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditUser(member);
                                  }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Member
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
        </>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />

      {/* Add Member Dialog */}
      <AddMemberDialog
        isOpen={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
        onMemberAdd={handleAddMember}
        isSubmitting={isSubmitting}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        isSubmitting={isSubmitting}
        user={selectedUser}
      />
    </div>
  );
}

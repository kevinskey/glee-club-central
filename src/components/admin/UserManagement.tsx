
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Search, Plus, RefreshCw, AlertCircle, MoreVertical, Edit, Trash2, Mail, Phone, Music } from "lucide-react";
import { useUserManagement, User } from '@/hooks/user/useUserManagement';
import { UserManagementTableMobile } from './UserManagementTableMobile';
import { AddUserDialog } from './AddUserDialog';
import { DatabaseConnectionTest } from './DatabaseConnectionTest';
import { UserManagementMobile } from './UserManagementMobile';
import { toast } from 'sonner';
import { UserManagementData } from '@/services/userManagementService';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { 
    users, 
    isLoading, 
    error, 
    refreshUsers, 
    updateUser: handleUpdateUser,
    addUser: handleAddUserAction,
    deleteUser: handleDeleteUser
  } = useUserManagement();

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  // Transform User[] to UserManagementData[] format
  const transformedUsers: UserManagementData[] = users
    .filter(user => user.email) // Filter out users without email
    .map(user => ({
      id: user.id,
      email: user.email!, // Assert non-null since we filtered
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown User',
      role: user.role || 'member', // Ensure role is always present
      status: user.status || 'active',
      disabled: user.disabled || false,
      is_super_admin: user.is_super_admin || false,
      created_at: user.created_at || new Date().toISOString(),
      last_sign_in_at: user.last_sign_in_at,
      phone: user.phone,
      voice_part: user.voice_part,
      avatar_url: user.avatar_url,
      join_date: user.join_date,
      class_year: user.class_year,
      dues_paid: user.dues_paid,
      notes: user.notes
    }));

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const success = await handleUpdateUser(userId, { role: newRole });
    if (success) {
      toast.success('User role updated successfully');
    } else {
      toast.error('Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId: string, isDisabled: boolean) => {
    const success = await handleUpdateUser(userId, { disabled: isDisabled });
    if (success) {
      toast.success(`User ${isDisabled ? 'disabled' : 'enabled'} successfully`);
    } else {
      toast.error('Failed to update user status');
    }
  };

  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  const handleUserAdded = () => {
    refreshUsers();
    setShowAddDialog(false);
  };

  const handleImportUsers = () => {
    setShowImportDialog(true);
  };

  const handleImportComplete = () => {
    setShowImportDialog(false);
    refreshUsers();
  };

  const handleRefresh = async () => {
    await refreshUsers();
  };

  const filteredUsers = transformedUsers.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 space-y-2 md:p-4 md:space-y-4">
      {/* Mobile View */}
      <div className="block md:hidden">
        <UserManagementMobile
          users={users}
          onUserSelect={(user) => {
            console.log('Selected user:', user);
          }}
          onAddUser={handleAddUser}
          isLoading={isLoading}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block space-y-2 md:space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-2xl font-bold">User Management</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Manage Glee Club members ({users.length} total)</p>
          </div>
          <div className="flex gap-1 md:gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading} className="text-xs md:text-sm h-8 md:h-9">
              <RefreshCw className={`mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button onClick={handleAddUser} size="sm" className="text-xs md:text-sm h-8 md:h-9">
              <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Add Member</span>
            </Button>
          </div>
        </div>
        
        <DatabaseConnectionTest />
        
        {error && (
          <Alert variant="destructive" className="text-xs md:text-sm">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            <AlertTitle className="text-xs md:text-sm">Error</AlertTitle>
            <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Search - More Compact */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          <input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-6 md:pl-8 h-7 md:h-9 w-full rounded-md border border-input bg-background px-2 md:px-3 py-1 text-xs md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 md:py-8">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground">Loading members...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8 md:w-12 text-xs md:text-sm"></TableHead>
                  <TableHead className="text-xs md:text-sm">Name</TableHead>
                  <TableHead className="text-xs md:text-sm">Email</TableHead>
                  <TableHead className="text-xs md:text-sm">Phone</TableHead>
                  <TableHead className="text-xs md:text-sm">Voice Part</TableHead>
                  <TableHead className="text-xs md:text-sm">Class</TableHead>
                  <TableHead className="text-xs md:text-sm">Role</TableHead>
                  <TableHead className="text-xs md:text-sm">Status</TableHead>
                  <TableHead className="text-xs md:text-sm">Dues</TableHead>
                  <TableHead className="w-8 md:w-12 text-xs md:text-sm"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4 md:py-8">
                      <Users className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-semibold mb-1 text-xs md:text-sm">No Members Found</h3>
                      <p className="text-muted-foreground text-xs">
                        {users.length === 0 
                          ? 'No members have been added yet.' 
                          : 'No members match your search criteria.'
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="py-1 md:py-2">
                        <Avatar className="h-6 w-6 md:h-8 md:w-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        <div className="font-medium text-xs md:text-sm">
                          {user.first_name} {user.last_name}
                        </div>
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="mr-1 h-2 w-2 md:h-3 md:w-3" />
                          <span className="truncate max-w-[120px] md:max-w-none">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        {user.phone && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="mr-1 h-2 w-2 md:h-3 md:w-3" />
                            <span className="truncate">{user.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        {user.voice_part && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            <Music className="mr-1 h-2 w-2" />
                            <span className="hidden md:inline">{user.voice_part.replace('_', ' ')}</span>
                            <span className="md:hidden">{user.voice_part.replace('_', ' ').substring(0, 2)}</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        {user.class_year && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {user.class_year}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'} className="text-xs px-1 py-0">
                          {user.is_super_admin ? 'Super' : user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs px-1 py-0">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        {user.dues_paid && (
                          <Badge variant="default" className="bg-green-600 text-xs px-1 py-0">
                            ✓
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-1 md:py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 md:h-8 md:w-8 p-0">
                              <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-xs md:text-sm">
                              <Edit className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive text-xs md:text-sm">
                              <Trash2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                              Delete Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Add User Dialog */}
        <AddUserDialog 
          isOpen={showAddDialog} 
          onClose={() => setShowAddDialog(false)}
          onCreateUser={handleUserAdded}
          onImportUsers={handleImportUsers}
        />

        {/* Import Users Dialog */}
        {showImportDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold">Import Users from CSV</h2>
                <Button variant="ghost" onClick={() => setShowImportDialog(false)} className="text-lg md:text-xl">
                  ×
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Upload a CSV file with user information to bulk import members.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      toast.info('CSV import functionality coming soon');
                      handleImportComplete();
                    }
                  }}
                  className="block w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

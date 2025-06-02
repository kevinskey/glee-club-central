import React, { useState, useEffect } from 'react';
import { useUserManagement, User } from '@/hooks/user/useUserManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Users, Search, AlertTriangle } from 'lucide-react';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { AddUserDialog } from './AddUserDialog';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import { toast } from 'sonner';

export default function UserManagement() {
  const {
    users,
    isLoading,
    error,
    refreshUsers,
    updateUser,
    addUser,
    deleteUser
  } = useUserManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    refreshUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.voice_part?.toLowerCase().includes(searchLower)
    );
  });

  const handleAddUser = async (userData: UserFormValues) => {
    try {
      const success = await addUser(userData);
      if (success) {
        setShowAddForm(false);
        await refreshUsers();
        toast.success('User added successfully');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const success = await updateUser(userId, userData);
      if (success) {
        setEditingUser(null);
        await refreshUsers();
        toast.success('User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const success = await deleteUser(userId);
        if (success) {
          await refreshUsers();
          toast.success('User deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCreateUser = () => {
    setShowAddForm(true);
  };

  const handleImportUsers = () => {
    setShowImportDialog(true);
  };

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Error loading users: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-muted-foreground">
              Manage Glee Club members and their information
            </p>
          </div>
        </div>
        
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Badge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Badge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.is_super_admin || u.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or voice part..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={filteredUsers}
            isLoading={isLoading}
            onEdit={setEditingUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      {/* Add User Selection Dialog */}
      <AddUserDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onCreateUser={handleCreateUser}
        onImportUsers={handleImportUsers}
      />

      {/* Add User Form */}
      {showAddForm && (
        <UserForm
          onSubmit={handleAddUser}
          onCancel={() => setShowAddForm(false)}
          title="Add New User"
        />
      )}

      {/* Edit User Form */}
      {editingUser && (
        <UserForm
          user={editingUser}
          onSubmit={(data) => handleUpdateUser(editingUser.id, data)}
          onCancel={() => setEditingUser(null)}
          title="Edit User"
        />
      )}

      {/* TODO: Add import dialog component here when ready */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Import Users</h3>
            <p className="text-sm text-muted-foreground mb-4">
              CSV import functionality will be implemented here.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowImportDialog(false)}>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

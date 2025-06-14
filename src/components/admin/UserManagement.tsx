
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, Search, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useUserManagement, User } from '@/hooks/user/useUserManagement';
import { UserManagementTable } from './UserManagementTable';
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
    <div className="container mx-auto px-4 py-8">
      {/* Mobile View */}
      <div className="block md:hidden">
        <UserManagementMobile
          users={users}
          onUserSelect={(user) => {
            // Handle user selection - could open a modal or navigate
            console.log('Selected user:', user);
          }}
          onAddUser={handleAddUser}
          isLoading={isLoading}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <PageHeader
          title="User Management"
          description="Manage Glee Club members and their roles"
          icon={<Users className="h-6 w-6" />}
        />
        
        {/* Database Connection Test */}
        <DatabaseConnectionTest />
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Members Directory ({users.length})</CardTitle>
            <Button onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex mb-4 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading members...</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <UserManagementTable
                    users={filteredUsers}
                    onRoleUpdate={handleRoleUpdate}
                    onStatusToggle={handleStatusToggle}
                    isLoading={isLoading}
                  />
                </div>
                
                {/* Mobile Table for medium screens */}
                <div className="block lg:hidden">
                  <UserManagementTableMobile
                    users={filteredUsers}
                    onRoleUpdate={handleRoleUpdate}
                    onStatusToggle={handleStatusToggle}
                    isLoading={isLoading}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Import Users from CSV</h2>
                <Button variant="ghost" onClick={() => setShowImportDialog(false)}>
                  ×
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with user information to bulk import members.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle CSV file upload
                      toast.info('CSV import functionality coming soon');
                      handleImportComplete();
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

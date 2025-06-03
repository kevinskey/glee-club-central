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
import { AddUserDialog } from './AddUserDialog';
import { DatabaseConnectionTest } from './DatabaseConnectionTest';
import { UserManagementMobile } from './UserManagementMobile';
import { toast } from 'sonner';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
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
  };

  const handleRefresh = async () => {
    await refreshUsers();
  };

  const filteredUsers = users.filter(user => 
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
              <UserManagementTable
                users={filteredUsers}
                onRoleUpdate={handleRoleUpdate}
                onStatusToggle={handleStatusToggle}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
        
        {/* Add User Dialog */}
        <AddUserDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog}
          onUserAdded={handleUserAdded}
        />
      </div>
    </div>
  );
}

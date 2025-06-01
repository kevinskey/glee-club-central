
import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Users, Plus, Search, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { UserManagementTableMobile } from '@/components/admin/UserManagementTableMobile';
import { InviteUserModal } from '@/components/admin/InviteUserModal';
import { userManagementService, UserManagementData } from '@/services/userManagementService';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { AdminMobileSidebar } from '@/components/admin/AdminMobileSidebar';
import { PageLoader } from '@/components/ui/page-loader';

export default function UserManagementPage() {
  const { user, profile, isAuthenticated, isLoading: authLoading, isAdmin } = useSimpleAuthContext();
  const [users, setUsers] = useState<UserManagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled' | 'invited'>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Check if user has admin access
  const hasAdminAccess = isAdmin();

  // Show loading while auth is initializing
  if (authLoading) {
    return <PageLoader message="Verifying admin access..." className="min-h-screen" />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wait for profile to load
  if (!profile) {
    return <PageLoader message="Loading user profile..." className="min-h-screen" />;
  }

  // Check admin access and redirect if not admin
  if (!hasAdminAccess) {
    toast.error("Access denied. Admin privileges required.");
    return <Navigate to="/" replace />;
  }

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userManagementService.getUsers();
      setUsers(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load users';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLoadUsers = () => {
    loadUsers();
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchLower));
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'active') {
        matchesStatus = !user.disabled && user.status !== 'invited';
      } else if (statusFilter === 'disabled') {
        matchesStatus = user.disabled;
      } else if (statusFilter === 'invited') {
        matchesStatus = user.status === 'invited';
      }
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [users, searchTerm, sortOrder, statusFilter]);

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await userManagementService.updateUserRole(userId, newRole);
      await loadUsers(); // Refresh the list
      toast.success('User role updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user role';
      toast.error(errorMessage);
      console.error('Error updating user role:', error);
    }
  };

  const handleStatusToggle = async (userId: string, isDisabled: boolean) => {
    try {
      await userManagementService.toggleUserStatus(userId, isDisabled);
      await loadUsers(); // Refresh the list
      toast.success(`User ${isDisabled ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user status';
      toast.error(errorMessage);
      console.error('Error updating user status:', error);
    }
  };

  const handleInviteUser = async (email: string, role: string, firstName?: string, lastName?: string) => {
    try {
      await userManagementService.inviteUser(email, role, firstName, lastName);
      await loadUsers(); // Refresh the list
      toast.success('User invited successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite user';
      toast.error(errorMessage);
      console.error('Error inviting user:', error);
    }
  };

  // Show error state with retry option
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {!isMobile && (
          <div className="flex h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminTopBar />
              <main className="flex-1 overflow-auto">
                <div className="container mx-auto p-6 space-y-6">
                  <PageHeader
                    title="User Management"
                    description="Manage all users in the system"
                    icon={<Users className="h-6 w-6" />}
                  />
                  <Card>
                    <CardContent className="text-center py-8">
                      <h3 className="font-semibold mb-2 text-destructive">Error Loading Users</h3>
                      <p className="text-muted-foreground mb-4">{error}</p>
                      <Button onClick={retryLoadUsers}>
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </main>
            </div>
          </div>
        )}
        
        {isMobile && (
          <div className="min-h-screen">
            <AdminTopBar 
              onMenuClick={() => setSidebarOpen(true)}
              isMobile={true}
            />
            <AdminMobileSidebar 
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="pt-16">
              <div className="p-4 space-y-6">
                <PageHeader
                  title="User Management"
                  description="Manage all users in the system"
                  icon={<Users className="h-6 w-6" />}
                />
                <Card>
                  <CardContent className="text-center py-8">
                    <h3 className="font-semibold mb-2 text-destructive">Error Loading Users</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={retryLoadUsers} className="w-full">
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex h-screen">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminTopBar />
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-6 space-y-6">
                <PageHeader
                  title="User Management"
                  description="Manage all users in the system"
                  icon={<Users className="h-6 w-6" />}
                />

                {/* Filters and Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filters & Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-row gap-4 items-center">
                      {/* Search */}
                      <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {/* Status Filter */}
                      <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                          <SelectItem value="invited">Invited</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Sort Order */}
                      <Button
                        variant="outline"
                        onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center gap-2"
                      >
                        {sortOrder === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                        {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                      </Button>

                      {/* Invite User Button */}
                      <Button onClick={() => setIsInviteModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Invite User
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Users ({filteredAndSortedUsers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <PageLoader message="Loading users..." />
                    ) : filteredAndSortedUsers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {users.length === 0 ? 'No members found' : 'No users match your search criteria'}
                      </div>
                    ) : (
                      <UserManagementTable
                        users={filteredAndSortedUsers}
                        onRoleUpdate={handleRoleUpdate}
                        onStatusToggle={handleStatusToggle}
                        isLoading={isLoading}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Invite User Modal */}
                <InviteUserModal
                  isOpen={isInviteModalOpen}
                  onClose={() => setIsInviteModalOpen(false)}
                  onInvite={handleInviteUser}
                />
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="min-h-screen">
          <AdminTopBar 
            onMenuClick={() => setSidebarOpen(true)}
            isMobile={true}
          />
          <AdminMobileSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="pt-16">
            <div className="p-4 space-y-6">
              <PageHeader
                title="User Management"
                description="Manage all users in the system"
                icon={<Users className="h-6 w-6" />}
              />

              {/* Filters and Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters & Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 items-start">
                    {/* Search */}
                    <div className="relative w-full min-w-0">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                        <SelectItem value="invited">Invited</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort Order */}
                    <Button
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                      className="flex items-center gap-2 w-full justify-center"
                    >
                      {sortOrder === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                      {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                    </Button>

                    {/* Invite User Button */}
                    <Button 
                      onClick={() => setIsInviteModalOpen(true)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Invite User
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table/Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Users ({filteredAndSortedUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <PageLoader message="Loading users..." />
                  ) : filteredAndSortedUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {users.length === 0 ? 'No members found' : 'No users match your search criteria'}
                    </div>
                  ) : (
                    <UserManagementTableMobile
                      users={filteredAndSortedUsers}
                      onRoleUpdate={handleRoleUpdate}
                      onStatusToggle={handleStatusToggle}
                      isLoading={isLoading}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Invite User Modal */}
              <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInviteUser}
              />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

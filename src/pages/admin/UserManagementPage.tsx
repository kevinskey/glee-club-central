
import React, { useState, useEffect, useMemo } from 'react';
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
import { InviteUserModal } from '@/components/admin/InviteUserModal';
import { userManagementService, UserManagementData } from '@/services/userManagementService';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserManagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled' | 'invited'>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userManagementService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
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
    await userManagementService.updateUserRole(userId, newRole);
    await loadUsers(); // Refresh the list
  };

  const handleStatusToggle = async (userId: string, isDisabled: boolean) => {
    await userManagementService.toggleUserStatus(userId, isDisabled);
    await loadUsers(); // Refresh the list
  };

  const handleInviteUser = async (email: string, role: string, firstName?: string, lastName?: string) => {
    await userManagementService.inviteUser(email, role, firstName, lastName);
    await loadUsers(); // Refresh the list
  };

  return (
    <div className="space-y-6">
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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
          <UserManagementTable
            users={filteredAndSortedUsers}
            onRoleUpdate={handleRoleUpdate}
            onStatusToggle={handleStatusToggle}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
    </div>
  );
}

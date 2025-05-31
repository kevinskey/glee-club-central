
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserManagementData } from '@/services/userManagementService';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface UserManagementTableProps {
  users: UserManagementData[];
  onRoleUpdate: (userId: string, newRole: string) => Promise<void>;
  onStatusToggle: (userId: string, isDisabled: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function UserManagementTable({
  users,
  onRoleUpdate,
  onStatusToggle,
  isLoading = false
}: UserManagementTableProps) {
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUsers(prev => new Set(prev).add(userId));
    try {
      await onRoleUpdate(userId, newRole);
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setUpdatingUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleStatusToggle = async (userId: string, currentDisabled: boolean) => {
    setUpdatingUsers(prev => new Set(prev).add(userId));
    try {
      await onStatusToggle(userId, !currentDisabled);
      toast.success(`User ${!currentDisabled ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setUpdatingUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const getStatusBadge = (user: UserManagementData) => {
    if (user.disabled) {
      return <Badge variant="destructive">Disabled</Badge>;
    }
    if (user.status === 'invited') {
      return <Badge variant="secondary">Invited</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isUpdating = updatingUsers.has(user.id);
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.full_name}
                  {user.is_super_admin && (
                    <Badge variant="outline" className="ml-2">Admin</Badge>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role || 'member'}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="fan">Fan</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(user)}
                    <Switch
                      checked={!user.disabled}
                      onCheckedChange={() => handleStatusToggle(user.id, user.disabled)}
                      disabled={isUpdating}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'Unknown'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => {
                      // TODO: Implement password reset functionality
                      toast.info('Password reset functionality coming soon');
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset Password
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

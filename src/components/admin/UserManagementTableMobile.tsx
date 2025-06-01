
import React, { useState } from 'react';
import { format } from 'date-fns';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserManagementData } from '@/services/userManagementService';
import { RotateCcw, User, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface UserManagementTableMobileProps {
  users: UserManagementData[];
  onRoleUpdate: (userId: string, newRole: string) => Promise<void>;
  onStatusToggle: (userId: string, isDisabled: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function UserManagementTableMobile({
  users,
  onRoleUpdate,
  onStatusToggle,
  isLoading = false
}: UserManagementTableMobileProps) {
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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const isUpdating = updatingUsers.has(user.id);
        return (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                {user.full_name}
                {user.is_super_admin && (
                  <Badge variant="outline" className="text-xs">Admin</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              
              {/* Join Date */}
              {user.created_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {format(new Date(user.created_at), 'MMM dd, yyyy')}
                </div>
              )}
              
              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={user.role || 'member'}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="fan">Fan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Status</label>
                  <div>{getStatusBadge(user)}</div>
                </div>
                <Switch
                  checked={!user.disabled}
                  onCheckedChange={() => handleStatusToggle(user.id, user.disabled)}
                  disabled={isUpdating}
                />
              </div>
              
              {/* Actions */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => {
                    // TODO: Implement password reset functionality
                    toast.info('Password reset functionality coming soon');
                  }}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            No users found
          </CardContent>
        </Card>
      )}
    </div>
  );
}

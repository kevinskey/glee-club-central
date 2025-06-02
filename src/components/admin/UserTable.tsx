
import React from 'react';
import { User } from '@/hooks/user/useUserManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, Trash2, Shield, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UserTable({ users, isLoading, onEdit, onDelete }: UserTableProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'alumni':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getVoicePartDisplay = (voicePart: string | null) => {
    if (!voicePart) return 'Not assigned';
    
    const voicePartMap: Record<string, string> = {
      'soprano_1': 'Soprano 1',
      'soprano_2': 'Soprano 2',
      'alto_1': 'Alto 1',
      'alto_2': 'Alto 2',
      'tenor': 'Tenor',
      'bass': 'Bass',
      'director': 'Director'
    };
    
    return voicePartMap[voicePart] || voicePart;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'U';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Voice Part</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Dues</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || ''} alt={`${user.first_name} ${user.last_name}`} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.first_name, user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email || 'No email'}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {getVoicePartDisplay(user.voice_part)}
                </span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={`text-xs ${getStatusColor(user.status)}`}
                >
                  {user.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {user.is_super_admin ? (
                    <ShieldCheck className="h-3 w-3 text-orange-500" />
                  ) : user.role === 'admin' ? (
                    <Shield className="h-3 w-3 text-blue-500" />
                  ) : null}
                  <span className="text-sm capitalize">
                    {user.is_super_admin ? 'Super Admin' : user.role || 'Member'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={user.dues_paid ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.dues_paid ? 'Paid' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

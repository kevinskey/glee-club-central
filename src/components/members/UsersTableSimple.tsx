
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Check, Ban, AlertCircle } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface UsersTableSimpleProps {
  users: any[];
  isLoading: boolean;
  onViewDetails: (user: any) => void;
  onRoleChange: (userId: string, role: string) => Promise<void>;
  onStatusChange: (userId: string, status: string) => Promise<void>;
  formatDate: (date: string | null | undefined) => string;
  onDeleteClick?: (user: any) => void;
  isMobile?: boolean;
  isViewOnly?: boolean;
}

export function UsersTableSimple({
  users,
  isLoading,
  onViewDetails,
  onRoleChange,
  onStatusChange,
  formatDate,
  onDeleteClick,
  isMobile = false,
  isViewOnly = false
}: UsersTableSimpleProps) {
  const permissions = usePermissions();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-3 text-muted-foreground">Loading users...</p>
      </div>
    );
  }
  
  // No users state
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 font-semibold">No users found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-300">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-300">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-300">Pending</Badge>;
      case 'alumni':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-300">Alumni</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Mobile view (simplified table)
  if (isMobile) {
    return (
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-3 border rounded-lg bg-card"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {user.first_name || ''} {user.last_name || ''}
                </div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="outline">{user.role_display_name || user.role}</Badge>
                  {getStatusBadge(user.status)}
                </div>
              </div>
              
              <div className="flex">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDetails(user)} 
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                
                {!isViewOnly && permissions.canEditUsers && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.status === 'pending' && (
                        <DropdownMenuItem onClick={() => onStatusChange(user.id, 'active')}>
                          <Check className="mr-2 h-4 w-4" />
                          <span>Activate</span>
                        </DropdownMenuItem>
                      )}
                      {user.status === 'active' && (
                        <DropdownMenuItem onClick={() => onStatusChange(user.id, 'inactive')}>
                          <Ban className="mr-2 h-4 w-4" />
                          <span>Deactivate</span>
                        </DropdownMenuItem>
                      )}
                      {onDeleteClick && permissions.canDeleteUsers && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteClick(user)}
                          className="text-red-500 focus:text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Desktop view (full table)
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.first_name || ''} {user.last_name || ''}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role_display_name || user.role}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewDetails(user)} 
                    className="h-8"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  {!isViewOnly && permissions.canEditUsers && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.status === 'pending' && (
                          <DropdownMenuItem onClick={() => onStatusChange(user.id, 'active')}>
                            <Check className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                          </DropdownMenuItem>
                        )}
                        {user.status === 'active' && (
                          <DropdownMenuItem onClick={() => onStatusChange(user.id, 'inactive')}>
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                          </DropdownMenuItem>
                        )}
                        {onDeleteClick && permissions.canDeleteUsers && (
                          <DropdownMenuItem 
                            onClick={() => onDeleteClick(user)}
                            className="text-red-500 focus:text-red-500"
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

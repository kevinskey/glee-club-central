
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRoleBadge, getStatusBadge } from "@/components/members/UserBadges";
import { User } from "@/hooks/useUserManagement";

interface UsersTableSimpleProps {
  users: User[];
  isLoading: boolean;
  onViewDetails: (user: User) => void;
  onRoleChange?: (userId: string, role: string) => Promise<void>;
  onStatusChange?: (userId: string, status: string) => Promise<void>;
  onDeleteClick?: (user: User) => void;
  formatDate: (dateString?: string | null) => string;
}

export const UsersTableSimple: React.FC<UsersTableSimpleProps> = ({
  users,
  isLoading,
  onViewDetails,
  onRoleChange,
  onStatusChange,
  onDeleteClick,
  formatDate,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Voice Part</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <span className="ml-2">Loading members...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      {user.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                      ) : (
                        <AvatarFallback>
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.voice_part_display || "Not set"}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{formatDate(user.join_date)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(user)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {onRoleChange && onStatusChange && onDeleteClick && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onRoleChange(user.id, 'administrator')}
                          >
                            Set as Administrator
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onRoleChange(user.id, 'section_leader')}
                          >
                            Set as Section Leader
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onRoleChange(user.id, 'singer')}
                          >
                            Set as Singer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onStatusChange(user.id, 'active')}
                          >
                            Set Status to Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onStatusChange(user.id, 'inactive')}
                          >
                            Set Status to Inactive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteClick(user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

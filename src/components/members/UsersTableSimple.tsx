
import React, { useMemo } from "react";
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
  isMobile?: boolean;
}

export const UsersTableSimple: React.FC<UsersTableSimpleProps> = ({
  users,
  isLoading,
  onViewDetails,
  onRoleChange,
  onStatusChange,
  onDeleteClick,
  formatDate,
  isMobile = false,
}) => {
  // Memoize the table content to prevent unnecessary re-renders
  const tableContent = useMemo(() => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <span className="ml-2">Loading members...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    
    if (users.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            No members found.
          </TableCell>
        </TableRow>
      );
    }
    
    return users.map((user) => (
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
              <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">{user.email}</p>
            </div>
          </div>
        </TableCell>
        {!isMobile && (
          <>
            <TableCell className="hidden md:table-cell">{user.voice_part_display || "Not set"}</TableCell>
            <TableCell>{getRoleBadge(user.role)}</TableCell>
            <TableCell>{getStatusBadge(user.status)}</TableCell>
            <TableCell className="hidden md:table-cell">{formatDate(user.join_date)}</TableCell>
          </>
        )}
        {isMobile && (
          <TableCell>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </TableCell>
        )}
        <TableCell className="text-right">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewDetails(user);
              }}
              className="mr-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              {!isMobile && "View"}
            </Button>
            {onRoleChange && onStatusChange && onDeleteClick && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-[110] bg-background border shadow-md">
                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Setting user as Administrator");
                      // Use the exact value expected by the database
                      onRoleChange(user.id, 'administrator');
                    }}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Setting user as Section Leader");
                      onRoleChange(user.id, 'section_leader');
                    }}
                  >
                    Set as Section Leader
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Setting user as Singer");
                      onRoleChange(user.id, 'singer');
                    }}
                  >
                    Set as Singer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onStatusChange(user.id, 'active');
                    }}
                  >
                    Set Status to Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onStatusChange(user.id, 'inactive');
                    }}
                  >
                    Set Status to Inactive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDeleteClick(user);
                    }}
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
    ));
  }, [users, isLoading, onViewDetails, onRoleChange, onStatusChange, onDeleteClick, formatDate, isMobile]);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            {!isMobile ? (
              <>
                <TableHead className="hidden md:table-cell">Voice Part</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Join Date</TableHead>
              </>
            ) : (
              <TableHead>Details</TableHead>
            )}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableContent}
        </TableBody>
      </Table>
    </div>
  );
};

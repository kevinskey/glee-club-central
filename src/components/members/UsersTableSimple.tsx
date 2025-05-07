
import React from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/hooks/useUserManagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRoleBadge, getStatusBadge } from "./UserBadges";

interface UsersTableSimpleProps {
  users: User[];
  isLoading: boolean;
  onViewDetails: (user: User) => void;
  onRoleChange: (userId: string, role: string) => Promise<void>;
  onStatusChange: (userId: string, status: string) => Promise<void>;
  formatDate: (dateString?: string | null) => string;
}

export const UsersTableSimple: React.FC<UsersTableSimpleProps> = ({
  users,
  isLoading,
  onViewDetails,
  onRoleChange,
  onStatusChange,
  formatDate,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Join Date</TableHead>
            <TableHead className="hidden md:table-cell">Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
                  <p>Loading users...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                No users found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      {user.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                      ) : (
                        <AvatarFallback>
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${user.first_name || ''} ${user.last_name || ''}`}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(user.join_date)}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(user.last_sign_in_at)}</TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => onViewDetails(user)}>
                        Details
                      </Button>
                    </SheetTrigger>
                  </Sheet>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onRoleChange(user.id, "admin")}>
                        Set as Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRoleChange(user.id, "section_leader")}>
                        Set as Section Leader
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRoleChange(user.id, "student_conductor")}>
                        Set as Student Conductor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRoleChange(user.id, "accompanist")}>
                        Set as Accompanist
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRoleChange(user.id, "singer")}>
                        Set as Singer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRoleChange(user.id, "member")}>
                        Set as Member
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onStatusChange(user.id, "active")}>
                        Set Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(user.id, "inactive")}>
                        Set Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(user.id, "alumni")}>
                        Set Alumni
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

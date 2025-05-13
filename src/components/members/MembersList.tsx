import React, { memo, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { User } from "@/hooks/useUserManagement";
import { 
  UserCog, 
  Pencil, 
  Trash2, 
  MoreHorizontal,
  ShieldCheck
} from "lucide-react";
import { formatVoicePart, formatRole } from "./formatters/memberFormatters";

interface MembersListProps {
  members: User[];
  onChangeRole?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onManagePermissions?: (user: User) => void;
  // Fix type definitions to match what MembersPage is using
  onEditMember?: (user: User) => void;
  onDeleteMember?: (userId: string | User) => void;
  onStatusUpdate?: (userId: string, status: string) => Promise<boolean>;
  onStatusUpdateSuccess?: () => Promise<void>;
  canEdit?: boolean;
}

// Use memo to prevent unnecessary re-renders
export const MembersList = memo(function MembersList({ 
  members = [], // Provide default empty array to prevent null/undefined errors
  onChangeRole,
  onEditUser,
  onDeleteUser,
  onManagePermissions,
  // Add the new props to the destructured parameters
  onEditMember,
  onDeleteMember,
  onStatusUpdate,
  onStatusUpdateSuccess,
  canEdit = true
}: MembersListProps) {
  // For debugging
  console.log("MembersList rendering with", members.length, "members");
  
  // Format last login time - memoize to prevent recreation on render
  const formatLastLogin = useCallback((lastLogin: string | null) => {
    if (!lastLogin) return "Never";
    try {
      return formatDistanceToNow(new Date(lastLogin), { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  }, []);

  // Handle user deletion with proper type handling
  const handleDelete = useCallback((member: User) => {
    if (onDeleteMember) {
      onDeleteMember(member);
    } else if (onDeleteUser) {
      onDeleteUser(member.id);
    }
  }, [onDeleteMember, onDeleteUser]);

  // Handle user editing with proper type handling
  const handleEdit = useCallback((member: User) => {
    if (onEditMember) {
      onEditMember(member);
    } else if (onEditUser) {
      onEditUser(member);
    }
  }, [onEditMember, onEditUser]);

  // Filter out deleted members before rendering
  const activeMembers = members.filter(member => member.status !== 'deleted');
  console.log("MembersList active members:", activeMembers.length);
  
  return (
    <div className="border rounded-md mt-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Voice Part</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Last Seen</TableHead>
            {canEdit && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeMembers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canEdit ? 6 : 5} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
          ) : (
            activeMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.first_name} {member.last_name}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatVoicePart(member.voice_part)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{member.is_super_admin ? "Admin" : "Member"}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatLastLogin(member.last_sign_in_at)}
                </TableCell>
                {canEdit && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(onEditMember || onEditUser) && (
                          <DropdownMenuItem onClick={() => handleEdit(member)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                        )}
                        {onChangeRole && (
                          <DropdownMenuItem onClick={() => onChangeRole(member)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                        )}
                        {onManagePermissions && (
                          <DropdownMenuItem onClick={() => onManagePermissions(member)}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Permissions
                          </DropdownMenuItem>
                        )}
                        {/* Handle both onDeleteMember and onDeleteUser */}
                        {(onDeleteMember || onDeleteUser) && (
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => handleDelete(member)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

// Add display name for better debugging
MembersList.displayName = "MembersList";

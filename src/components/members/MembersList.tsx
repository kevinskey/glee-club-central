
import React from "react";
import { User } from "@/hooks/useUserManagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { getAvatarUrl } from "@/integrations/supabase/client";

// Format voice part for display
const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return "N/A";
  
  const parts: {[key: string]: string} = {
    soprano_1: "Soprano 1",
    soprano_2: "Soprano 2",
    alto_1: "Alto 1",
    alto_2: "Alto 2",
    tenor: "Tenor",
    bass: "Bass"
  };
  
  return parts[voicePart] || voicePart;
};

interface MembersListProps {
  members: User[];
}

export function MembersList({ members }: MembersListProps) {
  // Get initials from name
  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Voice Part</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
          )}
          
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage 
                      src={member.avatar_url ? getAvatarUrl(member.avatar_url) : undefined} 
                      alt={`${member.first_name} ${member.last_name}`} 
                    />
                    <AvatarFallback>
                      {getInitials(member.first_name, member.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.first_name} {member.last_name}</div>
                    <div className="text-sm text-muted-foreground">{member.email || "No email"}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatVoicePart(member.voice_part)}</TableCell>
              <TableCell>
                <Badge variant={member.status === "active" ? "default" : "secondary"}>
                  {member.status?.charAt(0).toUpperCase() + member.status?.slice(1) || "Pending"}
                </Badge>
              </TableCell>
              <TableCell>
                {member.title || 'Member'}
                {member.is_super_admin && (
                  <Badge variant="outline" className="ml-2 bg-primary-50 text-primary border-primary-200">
                    Admin
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/profile/${member.id}`} className="cursor-pointer">
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/attendance?member=${member.id}`} className="cursor-pointer">
                        View Attendance
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/admin/members`} className="cursor-pointer">
                        Manage Role & Permissions
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

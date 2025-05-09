
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User, UserCog, ShieldCheck } from 'lucide-react';
import { User as MemberUser } from '@/hooks/useUserManagement';
import { formatVoicePart, formatRole } from '@/utils/format';

interface MembersListProps {
  members: MemberUser[];
  onEditMember?: (member: MemberUser) => void;
  onDeleteMember?: (memberId: string) => void;
  onManagePermissions?: (member: MemberUser) => void;
}

// Helper functions to format display values
export const formatVoicePart = (voicePart: string | null): string => {
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

export const formatRole = (role: string): string => {
  const roles: {[key: string]: string} = {
    administrator: "Administrator",
    section_leader: "Section Leader",
    singer: "Singer",
    student_conductor: "Student Conductor",
    accompanist: "Accompanist",
    non_singer: "Non-Singer"
  };
  
  return roles[role] || role;
};

export function MembersList({ 
  members, 
  onEditMember, 
  onDeleteMember,
  onManagePermissions 
}: MembersListProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      case 'alumni':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Role</TableHead>
            <TableHead className="hidden md:table-cell">Voice Part</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {member.avatar_url ? (
                      <AvatarImage src={member.avatar_url} alt={`${member.first_name || ''} ${member.last_name || ''}`} />
                    ) : null}
                    <AvatarFallback>{getInitials(member.first_name || '', member.last_name || '')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.first_name} {member.last_name}</div>
                    <div className="text-sm text-muted-foreground hidden sm:block">{member.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatRole(member.role || '')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatVoicePart(member.voice_part)}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(member.status || 'pending')}>
                  {member.status?.charAt(0).toUpperCase() + member.status?.slice(1) || 'Pending'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {onEditMember && (
                      <DropdownMenuItem onClick={() => onEditMember(member)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Member
                      </DropdownMenuItem>
                    )}
                    
                    {onManagePermissions && (
                      <DropdownMenuItem onClick={() => onManagePermissions(member)}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Manage Permissions
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {onDeleteMember && (
                      <DropdownMenuItem 
                        className="text-destructive" 
                        onClick={() => onDeleteMember(member.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Member
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

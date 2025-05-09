
import React from 'react';
import { User } from '@/hooks/useUserManagement';
import { UserCog, Pencil, Trash2, ShieldCheck, Users } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MembersListProps {
  members: User[];
  onEditMember?: (member: User) => void;
  onDeleteMember?: (memberId: string) => void;
  onManagePermissions?: (member: User) => void;
  onChangeRole?: (member: User) => void;
}

export function MembersList({ 
  members, 
  onEditMember, 
  onDeleteMember,
  onManagePermissions,
  onChangeRole 
}: MembersListProps) {
  // Format voice part for display
  const formatVoicePart = (voicePart: string | null): string => {
    if (!voicePart) return "Not assigned";
    
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
  
  // Format role for display
  const formatRole = (role: string | null): string => {
    if (!role) return "Not assigned";
    
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
  
  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div 
          key={member.id}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-card"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={member.avatar_url || undefined} alt={`${member.first_name} ${member.last_name}`} />
              <AvatarFallback>{`${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{member.first_name} {member.last_name}</h3>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-wrap gap-2">
              <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="whitespace-nowrap">
                {(member.status || 'Pending').charAt(0).toUpperCase() + (member.status || 'pending').slice(1)}
              </Badge>
              <Badge variant="outline" className="whitespace-nowrap">
                {formatRole(member.role)}
              </Badge>
              {member.voice_part && (
                <Badge variant="outline" className="whitespace-nowrap bg-muted">
                  {formatVoicePart(member.voice_part)}
                </Badge>
              )}
            </div>
            
            <div className="flex justify-end mt-2 sm:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {onEditMember && (
                    <DropdownMenuItem onClick={() => onEditMember(member)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                  )}
                  
                  {onChangeRole && (
                    <DropdownMenuItem onClick={() => onChangeRole(member)}>
                      <Users className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                  )}
                  
                  {onManagePermissions && (
                    <DropdownMenuItem onClick={() => onManagePermissions(member)}>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Manage Permissions
                    </DropdownMenuItem>
                  )}
                  
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
            </div>
          </div>
        </div>
      ))}
      
      {members.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No members found</p>
        </div>
      )}
    </div>
  );
}

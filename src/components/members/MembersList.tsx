
import React from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/hooks/useUserManagement";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Shield, UserCog, UserCheck } from "lucide-react";

interface MembersListProps {
  members: User[];
  onEditMember?: (member: User) => void;
  onDeleteMember?: (memberId: string) => void;
  onManagePermissions?: (member: User) => void;
  onChangeRole?: (member: User) => void;
  onStatusUpdate?: (userId: string, status: string) => Promise<boolean>;
  onStatusUpdateSuccess?: () => Promise<void>;
}

// Format voice part for display 
const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return "Not set";
  
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
const formatRole = (role: string): string => {
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
  onManagePermissions,
  onChangeRole,
  onStatusUpdate,
  onStatusUpdateSuccess
}: MembersListProps) {
  // New function to handle status updates
  const handleStatusUpdate = async (member: User, newStatus: string) => {
    if (!onStatusUpdate || !onStatusUpdateSuccess) return;
    
    try {
      console.log(`Updating status for ${member.first_name} ${member.last_name} to ${newStatus}`);
      const success = await onStatusUpdate(member.id, newStatus);
      
      if (success) {
        console.log("Status update successful, triggering refresh");
        await onStatusUpdateSuccess();
      }
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Voice Part</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{member.first_name} {member.last_name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                    {member.class_year && (
                      <div className="text-xs text-muted-foreground">Class of {member.class_year}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatVoicePart(member.voice_part)}</TableCell>
                <TableCell>
                  <div>
                    <div>{formatRole(member.role || '')}</div>
                    {member.special_roles && (
                      <div className="text-xs text-muted-foreground">{member.special_roles}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {onStatusUpdate ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Badge 
                            variant={member.status === "active" ? "default" : "secondary"}
                            className="cursor-pointer hover:opacity-80"
                          >
                            {(member.status || 'pending').charAt(0).toUpperCase() + (member.status || 'pending').slice(1)}
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup value={member.status || ''}>
                            <DropdownMenuRadioItem 
                              value="active" 
                              onClick={() => handleStatusUpdate(member, 'active')}
                              className={member.status === 'active' ? 'bg-primary/10' : ''}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Active
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem 
                              value="pending" 
                              onClick={() => handleStatusUpdate(member, 'pending')}
                              className={member.status === 'pending' ? 'bg-primary/10' : ''}
                            >
                              Pending
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem 
                              value="inactive" 
                              onClick={() => handleStatusUpdate(member, 'inactive')}
                              className={member.status === 'inactive' ? 'bg-primary/10' : ''}
                            >
                              Inactive
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem 
                              value="alumni" 
                              onClick={() => handleStatusUpdate(member, 'alumni')}
                              className={member.status === 'alumni' ? 'bg-primary/10' : ''}
                            >
                              Alumni
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Badge variant={member.status === "active" ? "default" : "secondary"}>
                        {(member.status || 'pending').charAt(0).toUpperCase() + (member.status || 'pending').slice(1)}
                      </Badge>
                    )}
                    
                    {member.dues_paid && (
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        Dues Paid
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {(onEditMember || onDeleteMember || onManagePermissions || onChangeRole) && (
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
                            Edit Details
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
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                        )}
                        
                        {onDeleteMember && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => onDeleteMember(member.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Member
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
      </CardContent>
    </Card>
  );
}

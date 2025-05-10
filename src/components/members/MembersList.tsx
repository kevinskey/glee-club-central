
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
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Shield, UserCog } from "lucide-react";

interface MembersListProps {
  members: User[];
  onEditMember?: (member: User) => void;
  onDeleteMember?: (memberId: string) => void;
  onManagePermissions?: (member: User) => void;
  onChangeRole?: (member: User) => void;
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
  onChangeRole
}: MembersListProps) {
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
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>
                      {(member.status || 'pending').charAt(0).toUpperCase() + (member.status || 'pending').slice(1)}
                    </Badge>
                    
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

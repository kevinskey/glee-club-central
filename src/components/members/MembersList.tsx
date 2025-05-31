
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Shield, Settings } from "lucide-react";
import { User } from "@/hooks/user/useUserManagement";
import { formatVoicePart } from "./formatters/memberFormatters";

interface MembersListProps {
  members: User[];
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onManagePermissions?: (user: User) => void;
  onChangeRole?: (user: User) => void;
  canEdit?: boolean;
  // Legacy props for backward compatibility
  onEditMember?: (user: User) => void;
  onDeleteMember?: (userId: string) => void;
}

export function MembersList({ 
  members, 
  onEditUser, 
  onDeleteUser, 
  onManagePermissions,
  onChangeRole,
  canEdit = false,
  onEditMember,
  onDeleteMember
}: MembersListProps) {
  console.log("[DEBUG] MembersList rendering with", members?.length || 0, "members");
  
  // Use legacy props as fallback
  const handleEdit = onEditUser || onEditMember;
  const handleDelete = onDeleteUser || onDeleteMember;
  
  // Filter out deleted members at the component level as well
  const activeMembers = members.filter(member => member.status !== 'deleted');
  
  if (activeMembers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No members found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeMembers.map((member) => (
        <Card key={member.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback>
                    {member.first_name?.[0]}{member.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">
                      {member.first_name} {member.last_name}
                    </h3>
                    {member.is_super_admin && (
                      <Badge variant="destructive" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <div className="flex items-center gap-4 mt-1">
                    {member.voice_part && (
                      <span className="text-xs text-muted-foreground">
                        {formatVoicePart(member.voice_part)}
                      </span>
                    )}
                    {member.class_year && (
                      <span className="text-xs text-muted-foreground">
                        Class of {member.class_year}
                      </span>
                    )}
                    <Badge 
                      variant={member.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {canEdit && (
                <div className="flex items-center gap-2">
                  {onChangeRole && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onChangeRole(member)}
                      title="Change Role"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onManagePermissions && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onManagePermissions(member)}
                      title="Manage Permissions"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {handleEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member)}
                      title="Edit Member"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {handleDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      title="Delete Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

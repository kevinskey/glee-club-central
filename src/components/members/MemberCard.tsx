
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Shield, UserCog } from 'lucide-react';
import { User } from '@/hooks/user/useUserManagement';

interface MemberCardProps {
  member: User;
  onEdit?: (member: User) => void;
  onDelete?: (memberId: string) => void;
  onManagePermissions?: (member: User) => void;
  onChangeRole?: (member: User) => void;
  canEdit?: boolean;
}

export function MemberCard({
  member,
  onEdit,
  onDelete,
  onManagePermissions,
  onChangeRole,
  canEdit = false
}: MemberCardProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return '?';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.avatar_url || ''} />
            <AvatarFallback>
              {getInitials(member.first_name, member.last_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">
                {member.first_name} {member.last_name}
              </h3>
              {member.is_super_admin && (
                <Shield className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground truncate mb-2">
              {member.email}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="text-xs">
                {member.role || 'member'}
              </Badge>
              <Badge variant={getStatusVariant(member.status)} className="text-xs">
                {member.status || 'pending'}
              </Badge>
              {member.voice_part && (
                <Badge variant="secondary" className="text-xs">
                  {member.voice_part}
                </Badge>
              )}
            </div>
            
            {canEdit && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(member)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                {onChangeRole && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onChangeRole(member)}
                  >
                    <UserCog className="h-3 w-3" />
                  </Button>
                )}
                {onManagePermissions && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onManagePermissions(member)}
                  >
                    <Shield className="h-3 w-3" />
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(member.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

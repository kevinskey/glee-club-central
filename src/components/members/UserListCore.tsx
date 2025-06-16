
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Mail, 
  Phone,
  Music,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { UnifiedUser } from '@/hooks/user/useUnifiedUserManagement';

interface UserListCoreProps {
  users: UnifiedUser[];
  isAdmin: boolean;
  onEditUser: (user: UnifiedUser) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserListCore({ users, isAdmin, onEditUser, onDeleteUser }: UserListCoreProps) {
  const handleUserCardClick = (user: UnifiedUser) => {
    if (isAdmin) {
      onEditUser(user);
    }
  };

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <Card 
          key={user.id} 
          className={`transition-all duration-200 ${
            isAdmin 
              ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] hover:border-primary/50' 
              : ''
          }`}
          onClick={() => handleUserCardClick(user)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Mail className="mr-1 h-3 w-3" />
                    {user.email || 'No email'}
                  </p>
                  {user.phone && (
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Phone className="mr-1 h-3 w-3" />
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user.role && (
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                    {user.role}
                  </Badge>
                )}
                {user.voice_part && (
                  <Badge variant="outline">
                    <Music className="mr-1 h-3 w-3" />
                    {user.voice_part.replace('_', ' ')}
                  </Badge>
                )}
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status || 'active'}
                </Badge>
                {user.dues_paid && (
                  <Badge variant="default" className="bg-green-600">
                    Dues Paid
                  </Badge>
                )}
                {user.class_year && (
                  <Badge variant="outline">
                    Class {user.class_year}
                  </Badge>
                )}
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEditUser(user);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Member
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteUser(user.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

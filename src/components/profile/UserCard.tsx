
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Profile } from '@/types/auth';
import { 
  User, 
  Mail, 
  Phone, 
  Music,
  Eye,
  Edit
} from 'lucide-react';

interface UserCardProps {
  user: Profile;
  onView?: (user: Profile) => void;
  onEdit?: (user: Profile) => void;
  showActions?: boolean;
}

export function UserCard({ user, onView, onEdit, showActions = true }: UserCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <UserAvatar user={user} size="md" />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {user.first_name} {user.last_name}
            </h3>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              {user.voice_part && (
                <div className="flex items-center gap-2">
                  <Music className="h-3 w-3" />
                  <span>{user.voice_part}</span>
                </div>
              )}
              
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{user.phone}</span>
                </div>
              )}
              
              {user.class_year && (
                <div className="text-sm">
                  Class of {user.class_year}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'} className="text-xs">
                {user.is_super_admin ? 'Super Admin' : user.role || 'Member'}
              </Badge>
              
              <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                {user.status || 'Active'}
              </Badge>
              
              {user.dues_paid && (
                <Badge variant="default" className="bg-green-600 text-xs">
                  Dues Paid
                </Badge>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex flex-col gap-2">
              {onView && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onView(user)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              )}
              
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

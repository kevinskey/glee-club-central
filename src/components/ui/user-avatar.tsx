
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user?: {
    avatar_url?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-16 w-16'
};

const fallbackSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl'
};

export function UserAvatar({ 
  user, 
  size = 'md', 
  className, 
  fallbackClassName 
}: UserAvatarProps) {
  const getInitials = () => {
    if (!user) return 'U';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user?.avatar_url || undefined} alt="Profile" />
      <AvatarFallback className={cn(
        fallbackSizeClasses[size], 
        'bg-primary/10 text-primary font-medium',
        fallbackClassName
      )}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}

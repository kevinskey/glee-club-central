
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Shield, Home, Calendar, Music, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MobileHeaderDropdownMenuProps {
  className?: string;
}

export const MobileHeaderDropdownMenu: React.FC<MobileHeaderDropdownMenuProps> = ({ className }) => {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
          <Link to="/login">Login</Link>
        </Button>
        <Button size="sm" asChild className="h-8 px-2 text-xs">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  const userInitials = profile?.first_name && profile?.last_name 
    ? `${profile.first_name[0]}${profile.last_name[0]}` 
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-6 w-6 rounded-full p-0">
          <Avatar className="h-6 w-6">
            <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || 'User'} />
            <AvatarFallback className="text-xs font-medium">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 text-xs" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {profile?.first_name && (
              <p className="text-xs font-medium">{profile.first_name} {profile.last_name}</p>
            )}
            <p className="w-[120px] truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center text-xs">
            <Home className="mr-2 h-3 w-3" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/calendar" className="flex items-center text-xs">
            <Calendar className="mr-2 h-3 w-3" />
            Calendar
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center text-xs">
            <User className="mr-2 h-3 w-3" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        {isAdmin() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center text-xs">
                <Shield className="mr-2 h-3 w-3" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-xs">
          <LogOut className="mr-2 h-3 w-3" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

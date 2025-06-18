
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
      <div className={`flex gap-2 ${className}`}>
        <Button variant="ghost" size="sm" className="glass-button-secondary" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button size="sm" className="glass-button-primary" asChild>
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full glass-button">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || 'User'} />
            <AvatarFallback className="bg-[#0072CE]/20 text-[#0072CE] font-medium">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 glass-card border-white/20 rounded-2xl" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-4">
          <div className="flex flex-col space-y-1 leading-none">
            {profile?.first_name && (
              <p className="text-body font-medium text-foreground">{profile.first_name} {profile.last_name}</p>
            )}
            <p className="w-[200px] truncate text-caption text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-white/20" />
        
        <DropdownMenuItem asChild className="glass-hover rounded-xl m-1">
          <Link to="/dashboard/member" className="flex items-center text-body">
            <Home className="mr-3 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="glass-hover rounded-xl m-1">
          <Link to="/calendar" className="flex items-center text-body">
            <Calendar className="mr-3 h-4 w-4" />
            Calendar
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="glass-hover rounded-xl m-1">
          <Link to="/profile" className="flex items-center text-body">
            <User className="mr-3 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        {isAdmin() && (
          <>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem asChild className="glass-hover rounded-xl m-1">
              <Link to="/admin" className="flex items-center text-body">
                <Shield className="mr-3 h-4 w-4" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem onClick={handleLogout} className="glass-hover rounded-xl m-1 text-body">
          <LogOut className="mr-3 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

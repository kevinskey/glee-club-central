import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface ConsolidatedHeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export function ConsolidatedHeader({ onMenuClick, isMobile = false }: ConsolidatedHeaderProps) {
  const { user, logout, profile } = useAuth();
  const { theme } = useTheme();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className={`container mx-auto flex items-center justify-between px-4 ${theme === 'light' && !isMobile ? 'py-4' : 'py-2'}`}>
        {/* Menu Button (Mobile Only) */}
      {isMobile && onMenuClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Search...</span>
      </div>

      {/* Right Side - Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name || 'User'} />
                <AvatarFallback className="bg-orange-500 text-white text-xs">
                  {getInitials(profile?.first_name, profile?.last_name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>
    </header>
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileHeaderProps {
  onMenuClick?: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-14 flex items-center justify-between px-4">
      {/* Menu Button */}
      <Button variant="ghost" size="sm" onClick={onMenuClick}>
        <Menu className="h-7 w-7" />
      </Button>

      {/* Title */}
      <span className="font-semibold text-lg">GleeClub</span>

      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

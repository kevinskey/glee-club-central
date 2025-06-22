
import React, { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Menu, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Calendar,
  Music,
  Users,
  Store
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileHeaderProps {
  onMenuClick?: () => void;
}

const MobileHeaderComponent: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  const handleNavigation = useCallback((href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  }, [navigate]);

  // Memoize menu items to prevent recreation on every render
  const menuItems = React.useMemo(() => [
    { label: 'Dashboard', icon: User, href: '/dashboard' },
    { label: 'Calendar', icon: Calendar, href: '/calendar' },
    { label: 'Sheet Music', icon: Music, href: '/sheet-music' },
    { label: 'Members', icon: Users, href: '/members' },
    { label: 'Store', icon: Store, href: '/store' },
    ...(profile?.role === 'admin' ? [{ label: 'Admin', icon: Settings, href: '/admin' }] : [])
  ], [profile?.role]);

  return (
    <>
      <header className="mobile-header contain-layout top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 h-14 flex items-center justify-between px-4">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="h-10 w-10 bg-glee-spelman rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{profile?.role || 'Member'}</p>
                </div>
              </div>
              
              <nav className="flex-1 py-4 space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => handleNavigation(item.href)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </nav>
              
              <div className="border-t pt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => handleNavigation('/profile')}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <span className="font-semibold text-lg text-glee-spelman">GleeWorld</span>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="h-14 block md:hidden" />
    </>
  );
};

export const OptimizedMobileHeader = memo(MobileHeaderComponent);

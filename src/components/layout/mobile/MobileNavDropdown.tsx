import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Home, Calendar, Music, Store, Contact, Info, LogIn, UserPlus, User, LogOut, Shield, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useSSOAuth } from '@/hooks/useSSOAuth';

export function MobileNavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, logout, isAdmin } = useAuth();
  const { upcomingEvents } = useHomePageData();
  const { navigateToReader } = useSSOAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDashboardClick = () => {
    const isKnownAdmin = user?.email === 'kevinskey@mac.com';
    const hasAdminRole = isAdmin();
    
    if (isKnownAdmin || hasAdminRole) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
    setIsOpen(false);
  };

  const handleReaderClick = () => {
    navigateToReader();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative flex-shrink-0">
          <Menu className="h-5 w-5 text-[#003366] dark:text-white" />
          {/* Event indicator for mobile menu */}
          {upcomingEvents.length > 0 && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-[100] max-h-[90vh] overflow-y-auto"
        sideOffset={5}
      >
        {/* Header Section - more compact */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="text-sm font-semibold text-[#003366] dark:text-white truncate">Glee World</div>
          <div className="text-xs text-[#003366]/70 dark:text-white/70 truncate">Spelman College</div>
          {upcomingEvents.length > 0 && (
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center">
              <Bell className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Authentication section */}
        {!isAuthenticated ? (
          <>
            <DropdownMenuItem asChild>
              <Link 
                to="/login" 
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Login</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/signup" 
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Sign Up</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuItem 
              onClick={handleDashboardClick}
              className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <User className="mr-3 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Dashboard</span>
            </DropdownMenuItem>
            {isAdmin() && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <Shield className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Admin</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Sign Out</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Navigation Links - more compact */}
        <DropdownMenuItem asChild>
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Home className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Home</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Info className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="truncate">About</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link 
            to="/calendar" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 relative"
          >
            <Calendar className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Events</span>
            {upcomingEvents.length > 0 && (
              <div className="ml-auto h-2 w-2 bg-orange-500 rounded-full flex-shrink-0"></div>
            )}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={handleReaderClick}
          className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
        >
          <Music className="mr-3 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Reader</span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a 
            href="https://studio.gleeworld.org" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Music className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Studio</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a 
            href="https://merch.gleeworld.org" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Store className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Merch</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link 
            to="/store" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Store className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Store</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Contact className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Contact</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

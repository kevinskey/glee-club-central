
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Home, Calendar, Music, Store, Contact, Info, LogIn, UserPlus, User, LogOut, Shield, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHomePageData } from '@/hooks/useHomePageData';

export function MobileNavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, logout, isAdmin } = useAuth();
  const { upcomingEvents } = useHomePageData();

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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 relative">
          <Menu className="h-6 w-6 text-[#003366] dark:text-white" />
          {/* Event indicator for mobile menu */}
          {upcomingEvents.length > 0 && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full animate-pulse flex items-center justify-center">
              <span className="text-xs text-white font-bold">{upcomingEvents.length}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50"
      >
        {/* Enhanced Header Section */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="text-sm font-semibold text-[#003366] dark:text-white">Glee World</div>
          <div className="text-xs text-[#003366]/70 dark:text-white/70">Spelman College</div>
          {upcomingEvents.length > 0 && (
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center">
              <Bell className="h-3 w-3 mr-1" />
              {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Authentication section at the top */}
        {!isAuthenticated ? (
          <>
            <DropdownMenuItem asChild>
              <Link 
                to="/login" 
                className="flex items-center w-full px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="mr-3 h-4 w-4" />
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/signup" 
                className="flex items-center w-full px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="mr-3 h-4 w-4" />
                Sign Up
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuItem 
              onClick={handleDashboardClick}
              className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <User className="mr-3 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            {isAdmin() && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <Shield className="mr-3 h-4 w-4" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={handleLogout}
              className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Enhanced Navigation Links */}
        <DropdownMenuItem asChild>
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Home className="mr-3 h-4 w-4" />
            Home
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Info className="mr-3 h-4 w-4" />
            About
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link 
            to="/calendar" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 relative"
          >
            <Calendar className="mr-3 h-4 w-4" />
            Events
            {upcomingEvents.length > 0 && (
              <div className="ml-auto h-2 w-2 bg-orange-500 rounded-full"></div>
            )}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a 
            href="https://reader.gleeworld.org" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Music className="mr-3 h-4 w-4" />
            Music
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a 
            href="https://merch.gleeworld.org" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Store className="mr-3 h-4 w-4" />
            Shop
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            className="px-3 py-3 text-sm font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Contact className="mr-3 h-4 w-4" />
            Contact
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

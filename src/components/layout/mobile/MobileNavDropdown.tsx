
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Home, Calendar, Music, Store, Contact, Info, LogIn, UserPlus, User, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function MobileNavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, logout, isAdmin } = useAuth();

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
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50"
      >
        {/* Authentication section at the top */}
        {!isAuthenticated ? (
          <>
            <DropdownMenuItem asChild>
              <Link 
                to="/login" 
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#0072CE] hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="mr-3 h-4 w-4" />
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/signup" 
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#0072CE] hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <DropdownMenuItem onClick={handleDashboardClick}>
              <User className="mr-3 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            {isAdmin() && (
              <DropdownMenuItem asChild>
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <Shield className="mr-3 h-4 w-4" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Main Navigation Links - Reduced */}
        <DropdownMenuItem asChild>
          <Link to="/" onClick={() => setIsOpen(false)}>
            <Home className="mr-3 h-4 w-4" />
            Home
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/about" onClick={() => setIsOpen(false)}>
            <Info className="mr-3 h-4 w-4" />
            About
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/calendar" onClick={() => setIsOpen(false)}>
            <Calendar className="mr-3 h-4 w-4" />
            Events
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="https://reader.gleeworld.org" onClick={() => setIsOpen(false)}>
            <Music className="mr-3 h-4 w-4" />
            Music
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="https://merch.gleeworld.org" onClick={() => setIsOpen(false)}>
            <Store className="mr-3 h-4 w-4" />
            Shop
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            <Contact className="mr-3 h-4 w-4" />
            Contact
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

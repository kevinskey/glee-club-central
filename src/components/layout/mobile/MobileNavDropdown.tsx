
import React from 'react';
import { Link } from 'react-router-dom';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Home, 
  Info, 
  Calendar, 
  Store, 
  Phone, 
  LogIn, 
  UserPlus,
  User,
  LogOut
} from 'lucide-react';

export function MobileNavDropdown() {
  const { isAuthenticated, profile, logout } = useSimpleAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Navigation Links */}
        <DropdownMenuItem asChild>
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/about" className="flex items-center">
            <Info className="mr-2 h-4 w-4" />
            About
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/calendar" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/store" className="flex items-center">
            <Store className="mr-2 h-4 w-4" />
            Store
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/contact" className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            Contact
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Auth Links */}
        {isAuthenticated ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/role-dashboard" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/signup" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/login" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/join-glee-fam" className="flex items-center text-glee-purple">
                <UserPlus className="mr-2 h-4 w-4" />
                Join as Fan
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  const { isAuthenticated, profile, logout } = useAuth();

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
          <NavLink to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Home
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavLink to="/about" className="flex items-center">
            <Info className="mr-2 h-4 w-4" />
            About
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavLink to="/calendar" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavLink to="/store" className="flex items-center">
            <Store className="mr-2 h-4 w-4" />
            Store
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavLink to="/contact" className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            Contact
          </NavLink>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Auth Links */}
        {isAuthenticated ? (
          <>
            <DropdownMenuItem asChild>
              <NavLink to="/role-dashboard" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <NavLink to="/signup" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/login" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/join-glee-fam" className="flex items-center text-glee-purple">
                <UserPlus className="mr-2 h-4 w-4" />
                Join as Fan
              </NavLink>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

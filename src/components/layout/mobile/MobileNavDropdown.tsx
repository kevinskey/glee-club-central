
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { 
  Menu,
  Home,
  Info,
  Calendar,
  Mail,
  LogIn,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function MobileNavDropdown() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, logout } = useAuth();

  const handleItemClick = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-background border border-border shadow-lg z-[100]"
        sideOffset={5}
      >
        <DropdownMenuItem onClick={() => handleItemClick("/")}>
          <Home className="mr-2 h-4 w-4" />
          Home
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleItemClick("/about")}>
          <Info className="mr-2 h-4 w-4" />
          About
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleItemClick("/events")}>
          <Calendar className="mr-2 h-4 w-4" />
          Events
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleItemClick("/contact")}>
          <Mail className="mr-2 h-4 w-4" />
          Contact
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {isAuthenticated ? (
          <>
            <DropdownMenuItem onClick={() => handleItemClick("/role-dashboard")}>
              <User className="mr-2 h-4 w-4" />
              {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => handleItemClick("/login")}>
            <LogIn className="mr-2 h-4 w-4" />
            Member Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

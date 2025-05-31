
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
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function MobileNavDropdown() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Info, label: "About", path: "/about" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Mail, label: "Contact", path: "/contact" },
  ];

  const handleItemClick = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const handleOpenChange = (open: boolean) => {
    console.log("Dropdown open state:", open);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => console.log("Menu button clicked")}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-popover border shadow-md z-50"
        sideOffset={5}
      >
        {menuItems.map((item, index) => (
          <DropdownMenuItem 
            key={item.path}
            onClick={() => handleItemClick(item.path)}
            className="flex items-center cursor-pointer hover:bg-accent"
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Auth Action */}
        <DropdownMenuItem 
          onClick={handleAuthAction}
          className="flex items-center cursor-pointer hover:bg-accent"
        >
          {isAuthenticated ? (
            <>
              <User className="mr-2 h-4 w-4" />
              Sign Out
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Member Login
            </>
          )}
        </DropdownMenuItem>
        
        {isAuthenticated && (
          <DropdownMenuItem 
            onClick={() => handleItemClick("/role-dashboard")}
            className="flex items-center cursor-pointer hover:bg-accent"
          >
            <User className="mr-2 h-4 w-4" />
            {profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

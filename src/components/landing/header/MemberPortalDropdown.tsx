
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuProvider
} from "@/components/ui/dropdown-menu";

export function MemberPortalDropdown() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  
  const navigateToLogin = () => {
    console.log("Navigating to login");
    navigate("/login");
  };

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate("/login");
    }
  };
  
  return isAuthenticated ? (
    <DropdownMenuProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs flex items-center gap-1"
          >
            Member Portal
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-popover">
          <DropdownMenuLabel>Member Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenuProvider>
  ) : (
    <Button 
      size="sm"
      className="bg-glee-purple hover:bg-glee-spelman h-8 px-3 text-xs flex items-center gap-1"
      onClick={navigateToLogin}
    >
      <LogIn className="h-3.5 w-3.5 mr-1" /> Login
    </Button>
  );
}


import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function MemberPortalDropdown() {
  const navigate = useNavigate();
  
  const navigateToLogin = () => {
    console.log("Navigating to login");
    navigate("/login");
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="sm"
          className="bg-glee-purple hover:bg-glee-spelman h-8 px-3 text-xs flex items-center gap-1"
        >
          Member Portal <ChevronDown className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuItem 
          onClick={navigateToLogin}
          className="hover:bg-glee-spelman hover:text-white"
        >
          Login
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

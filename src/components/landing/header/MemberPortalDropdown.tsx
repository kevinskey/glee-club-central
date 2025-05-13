
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
    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
      Member Portal
    </DropdownMenuItem>
  ) : (
    <DropdownMenuItem onClick={navigateToLogin}>
      Member Portal
    </DropdownMenuItem>
  );
}

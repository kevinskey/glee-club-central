
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function MemberPortalDropdown() {
  const navigate = useNavigate();
  
  const navigateToLogin = () => {
    console.log("Navigating to login");
    navigate("/login");
  };
  
  return (
    <Button 
      size="sm"
      className="bg-glee-purple hover:bg-glee-spelman h-8 px-3 text-xs flex items-center gap-1"
      onClick={navigateToLogin}
    >
      <LogIn className="h-3.5 w-3.5 mr-1" /> Login
    </Button>
  );
}

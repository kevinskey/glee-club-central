
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

export function NavigationLinks({ className, onLinkClick }: NavigationLinksProps) {
  const { isAuthenticated } = useAuth();

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };
  
  return (
    <nav className={cn("flex gap-6", className)}>
      <Link
        to="/about"
        className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={handleLinkClick}
      >
        About Us
      </Link>
      {!isAuthenticated && (
        <Link
          to="/register/admin"
          className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
          onClick={handleLinkClick}
        >
          Admin Registration
        </Link>
      )}
    </nav>
  );
}

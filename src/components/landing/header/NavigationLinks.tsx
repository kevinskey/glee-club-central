
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

export function NavigationLinks({ className, onLinkClick }: NavigationLinksProps) {
  const { isAuthenticated, isAdmin } = useAuth();

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
      <Link
        to="/events"
        className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={handleLinkClick}
      >
        Events
      </Link>
      <Link
        to="/videos"
        className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={handleLinkClick}
      >
        Videos
      </Link>
      <Link
        to="/media"
        className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={handleLinkClick}
      >
        Media
      </Link>
      <Link
        to="/support"
        className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={handleLinkClick}
      >
        Support Us
      </Link>
      {isAuthenticated && (
        <Link
          to="/dashboard"
          className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
          onClick={handleLinkClick}
        >
          Dashboard
        </Link>
      )}
      {isAuthenticated && isAdmin && isAdmin() && (
        <Link
          to="/dashboard/admin"
          className="text-md font-medium text-glee-spelman transition-colors hover:text-glee-spelman/80"
          onClick={handleLinkClick}
        >
          Admin Panel
        </Link>
      )}
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


import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
    <NavigationMenu className={cn("", className)}>
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          <Link
            to="/press-kit"
            className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            Press Kit
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/about"
            className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            About
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/privacy"
            className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            Privacy
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/terms"
            className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            Terms
          </Link>
        </NavigationMenuItem>
        
        {!isAuthenticated && (
          <NavigationMenuItem>
            <Link
              to="/register/admin"
              className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={handleLinkClick}
            >
              Admin Registration
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

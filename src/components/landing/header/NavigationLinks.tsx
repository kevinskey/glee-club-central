
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
            className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            Press Kit
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/about"
            className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            About
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/privacy"
            className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            Privacy
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/terms"
            className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            Terms
          </Link>
        </NavigationMenuItem>
        
        {!isAuthenticated && (
          <NavigationMenuItem>
            <Link
              to="/auth/login"
              className="text-base md:text-lg font-inter font-medium text-glee-purple transition-colors hover:text-glee-purple/80"
              onClick={handleLinkClick}
            >
              Login
            </Link>
          </NavigationMenuItem>
        )}
        
        {!isAuthenticated && (
          <NavigationMenuItem>
            <Link
              to="/auth/login"
              className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={handleLinkClick}
            >
              Member Portal
            </Link>
          </NavigationMenuItem>
        )}
        
        {!isAuthenticated && (
          <NavigationMenuItem>
            <Link
              to="/auth/signup"
              className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={handleLinkClick}
            >
              Register
            </Link>
          </NavigationMenuItem>
        )}
        
        {!isAuthenticated && (
          <NavigationMenuItem>
            <Link
              to="/auth/signup?admin=true"
              className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
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

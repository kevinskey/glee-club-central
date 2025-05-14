
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
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
            to="/social"
            className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            Social
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/contact"
            className="text-base md:text-lg font-inter font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleLinkClick}
          >
            Contact
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/login"
            className="text-base md:text-lg font-inter font-medium flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            onClick={handleLinkClick}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

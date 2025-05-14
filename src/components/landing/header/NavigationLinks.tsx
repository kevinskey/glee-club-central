
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

interface NavigationLinksProps {
  className?: string;
}

export function NavigationLinks({ className = "" }: NavigationLinksProps) {
  const navigate = useNavigate();
  
  const handleLinkClick = () => {
    // Close any open navigation menu items when a link is clicked
    document.body.click();
  };
  
  return (
    <NavigationMenu className={`${className}`}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link
            to="/"
            className="text-base md:text-lg font-inter font-medium text-foreground hover:text-primary transition-colors"
            onClick={handleLinkClick}
          >
            Home
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/about"
            className="text-base md:text-lg font-inter font-medium text-foreground hover:text-primary transition-colors"
            onClick={handleLinkClick}
          >
            About
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/social"
            className="text-base md:text-lg font-inter font-medium text-foreground hover:text-primary transition-colors"
            onClick={handleLinkClick}
          >
            Social
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/contact"
            className="text-base md:text-lg font-inter font-medium text-foreground hover:text-primary transition-colors"
            onClick={handleLinkClick}
          >
            Contact
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link
            to="/press-kit"
            className="text-base md:text-lg font-inter font-medium text-foreground hover:text-primary transition-colors"
            onClick={handleLinkClick}
          >
            Press Kit
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Button
            variant="spelman"
            size="sm"
            className="px-4 py-1 h-auto rounded-full"
            asChild
          >
            <Link
              to="/login"
              className="text-base md:text-lg font-inter font-medium flex items-center gap-1"
              onClick={handleLinkClick}
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

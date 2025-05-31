
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface NavigationLinksProps {
  className?: string;
}

export function NavigationLinks({ className = "" }: NavigationLinksProps) {
  const location = useLocation();
  
  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Press Kit", href: "/press-kit" },
    { label: "Record Music", href: "/recordings/submit" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <nav className={`flex gap-1 items-center ${className}`}>
      {links.map((link) => {
        const isActive = location.pathname === link.href;
        
        return (
          <Button 
            key={link.href}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            asChild
            className={`text-sm font-medium ${
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-foreground/80 hover:text-foreground"
            }`}
          >
            <Link to={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}

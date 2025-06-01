
import React from "react";
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
          <Link
            key={link.href}
            to={link.href}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-foreground/80 hover:text-foreground hover:bg-accent/10"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

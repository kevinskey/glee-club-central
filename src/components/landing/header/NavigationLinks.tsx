
import React from "react";
import { Link } from "react-router-dom";

interface NavigationLinksProps {
  className?: string;
}

export function NavigationLinks({ className = "" }: NavigationLinksProps) {
  const navigationItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Music", path: "/music" },
    { label: "Calendar", path: "/calendar" },
  ];
  
  return (
    <nav className={`hidden md:flex items-center gap-6 ${className}`}>
      {navigationItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          className="text-foreground hover:text-primary transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

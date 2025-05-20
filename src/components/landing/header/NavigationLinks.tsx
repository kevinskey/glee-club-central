
import React from "react";
import { Link } from "react-router-dom";

interface NavigationLinksProps {
  className?: string;
}

export function NavigationLinks({ className = "" }: NavigationLinksProps) {
  const navigationItems = [
    { label: "About", path: "/about" },
    { label: "Calendar", path: "/calendar" },
    { label: "Music", path: "/music" },
    { label: "Social", path: "/social" },
    { label: "Contact", path: "/contact" },
  ];
  
  return (
    <nav className={`hidden md:flex items-center gap-4 lg:gap-6 ${className}`}>
      {navigationItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          className="text-foreground hover:text-primary transition-colors text-base lg:text-lg"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

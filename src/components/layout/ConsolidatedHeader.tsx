
import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderActions } from "./header/HeaderActions";
import { Button } from "@/components/ui/button";

// Memoize the ConsolidatedHeader component to prevent unnecessary re-renders
export const ConsolidatedHeader = memo(function ConsolidatedHeader() {
  const location = useLocation();
  
  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Calendar", href: "/calendar" },
    { label: "Store", href: "/store" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-3">
          <HeaderLogo />
        </div>
          
        {/* Middle: Navigation Links - Desktop only */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Button
                key={link.href}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                asChild
                className={`text-sm font-medium ${
                  isActive 
                    ? "bg-glee-spelman hover:bg-glee-spelman/90 text-white" 
                    : "text-foreground/80 hover:text-glee-spelman"
                }`}
              >
                <Link to={link.href}>{link.label}</Link>
              </Button>
            );
          })}
        </nav>

        {/* Right side: HeaderActions */}
        <HeaderActions />
      </div>
    </header>
  );
});

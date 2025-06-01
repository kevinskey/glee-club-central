
import React, { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderActions } from "./header/HeaderActions";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useSimpleAuthContext } from "@/contexts/SimpleAuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

// Memoize the ConsolidatedHeader component to prevent unnecessary re-renders
export const ConsolidatedHeader = memo(function ConsolidatedHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, profile, logout } = useSimpleAuthContext();
  const isMobile = useIsMobile();
  
  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Calendar", href: "/calendar" },
    { label: "Store", href: "/store" },
    { label: "Contact", href: "/contact" }
  ];

  const handleDashboardClick = () => {
    console.log('🎯 ConsolidatedHeader: Dashboard button clicked');
    navigate("/role-dashboard");
  };
  
  const handleLogout = async () => {
    try {
      console.log('🚪 ConsolidatedHeader: Logout initiated');
      await logout();
      console.log('🚪 ConsolidatedHeader: Logout successful, redirecting to home');
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-6 md:gap-8">
          {/* Left side: Logo and site name */}
          <div className="flex items-center flex-shrink-0">
            <HeaderLogo />
          </div>
            
          {/* Middle: Navigation Links - Desktop only */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {navigationLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium relative px-4 lg:px-5 py-2 rounded-md transition-colors ${
                    isActive 
                      ? "bg-transparent text-glee-spelman after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-glee-spelman" 
                      : "text-foreground/80 hover:text-glee-spelman hover:bg-accent/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Auth buttons and HeaderActions */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {/* Authentication Buttons */}
            {!isAuthenticated ? (
              <Button 
                variant="default"
                onClick={handleDashboardClick}
                size="sm"
                className="bg-glee-spelman hover:bg-glee-spelman/90 px-3 py-1 h-8 text-xs lg:px-4 lg:h-9 lg:text-sm"
              >
                <User className="w-3 h-3 mr-1 lg:w-4 lg:h-4 lg:mr-2" />
                <span className="hidden sm:inline">My Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={handleLogout}
                size="sm"
                className="border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10 px-3 py-1 h-8 text-xs lg:px-4 lg:h-9 lg:text-sm"
              >
                <LogOut className="w-3 h-3 mr-1 lg:w-4 lg:h-4 lg:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            )}
            
            {/* HeaderActions (theme toggle, etc.) */}
            <HeaderActions />
          </div>
        </div>
      </div>
    </header>
  );
});

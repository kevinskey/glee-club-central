
import React, { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderActions } from "./header/HeaderActions";
import { Button } from "@/components/ui/button";
import { LogIn, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

// Memoize the ConsolidatedHeader component to prevent unnecessary re-renders
export const ConsolidatedHeader = memo(function ConsolidatedHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, profile, logout } = useAuth();
  const isMobile = useIsMobile();
  
  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Calendar", href: "/calendar" },
    { label: "Store", href: "/store" },
    { label: "Contact", href: "/contact" }
  ];

  const handleDashboardClick = () => {
    navigate("/role-dashboard");
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

        {/* Right side: Auth buttons and HeaderActions */}
        <div className="flex items-center gap-2">
          {/* Authentication Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="default"
                onClick={handleDashboardClick}
                size={isMobile ? "sm" : "default"}
                className="bg-glee-spelman hover:bg-glee-spelman/90"
              >
                <User className="w-4 h-4 mr-2" />
                {isMobile ? 'Dashboard' : (profile?.first_name ? `${profile.first_name}'s Dashboard` : 'My Dashboard')}
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
                size={isMobile ? "sm" : "default"}
                className="border-glee-spelman text-glee-spelman hover:bg-glee-spelman/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isMobile ? 'Out' : 'Sign Out'}
              </Button>
            </div>
          ) : (
            <Button 
              variant="default"
              onClick={() => navigate("/login")}
              size={isMobile ? "sm" : "default"}
              className="bg-glee-spelman hover:bg-glee-spelman/90"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isMobile ? 'Login' : 'Member Login'}
            </Button>
          )}
          
          {/* HeaderActions (theme toggle, etc.) */}
          <HeaderActions />
        </div>
      </div>
    </header>
  );
});

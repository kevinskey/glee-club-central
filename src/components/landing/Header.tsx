
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeaderLogo } from "@/components/layout/header/HeaderLogo";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { MobileNavDropdown } from "@/components/layout/mobile/MobileNavDropdown";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icons } from "@/components/Icons";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, user, logout, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  
  console.log("Header render - isMobile:", isMobile, "window width:", window.innerWidth);
  
  const handleDashboardClick = () => {
    const isKnownAdmin = user?.email === 'kevinskey@mac.com';
    const hasAdminRole = isAdmin();
    
    if (isKnownAdmin || hasAdminRole) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
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
    <header className="sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 bg-white/90 dark:bg-gray-800/90 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md">
        {/* Logo - Always visible */}
        <div className="flex-shrink-0">
          <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
            <Icons.logo className="h-7 w-auto" />
            <span className="text-base ml-2 text-black dark:text-white font-semibold">Glee World</span>
          </Link>
        </div>
        
        {/* Desktop Navigation - Hidden on mobile */}
        <nav className={`items-center space-x-8 flex-1 justify-center ${isMobile ? 'hidden' : 'flex'}`}>
          <Link to="/" className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            About
          </Link>
          <Link to="/calendar" className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Events
          </Link>
          <Link to="/store" className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Store
          </Link>
          <Link to="/contact" className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Contact
          </Link>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Theme Toggle - Now wider */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
          
          {/* Desktop Auth Buttons - Hidden on mobile */}
          <div className={`items-center gap-3 ${isMobile ? 'hidden' : 'flex'}`}>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  onClick={handleDashboardClick}
                  className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/signup")}
                  className="text-sm border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigate("/login")}
                  className="text-sm bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Actions - Shown only on mobile */}
          <div className={`items-center gap-1 ${isMobile ? 'flex' : 'hidden'}`}>
            {isAuthenticated ? (
              <Button 
                variant="default"
                onClick={handleDashboardClick}
                size="sm"
                className="h-8 w-8 p-0 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
              >
                <User className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button 
                variant="default"
                onClick={() => navigate("/login")}
                size="sm"
                className="h-8 px-2 text-xs bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                Login
              </Button>
            )}
            <MobileNavDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}

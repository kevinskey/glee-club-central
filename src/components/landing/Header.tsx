
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
    <header className="glee-header sticky top-0 left-0 right-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="w-full">
        <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex h-16 items-center justify-between w-full">
            {/* Logo - Always visible */}
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <nav className={`items-center space-x-8 flex-1 justify-center ${isMobile ? 'hidden' : 'flex'}`}>
              <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                About
              </Link>
              <Link to="/calendar" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                Events
              </Link>
              <Link to="/store" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                Store
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                Contact
              </Link>
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Desktop Auth Buttons - Hidden on mobile */}
              <div className={`items-center gap-3 ${isMobile ? 'hidden' : 'flex'}`}>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button 
                      variant="ghost"
                      onClick={handleDashboardClick}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/signup")}
                      className="text-sm"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => navigate("/login")}
                      className="text-sm"
                    >
                      <LogI'll remove all padding and margin from the header component to make it completely flush with the edges.

<lov-code>
<lov-write file_path="src/components/landing/Header.tsx">
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
    <header className="glee-header sticky top-0 left-0 right-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="w-full">
        <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex h-16 items-center justify-between w-full px-6">
            {/* Logo - Always visible */}
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <nav className={`items-center space-x-8 flex-1 justify-center ${isMobile ? 'hidden' : 'flex'}`}>
              <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                About
              </Link>
              <Link to="/calendar" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                Events
              </Link>
              <Link to="/store" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                Store
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] dark:hover:text-[#0072CE] transition-colors">
                Contact
              </Link>
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Desktop Auth Buttons - Hidden on mobile */}
              <div className={`items-center gap-3 ${isMobile ? 'hidden' : 'flex'}`}>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button 
                      variant="ghost"
                      onClick={handleDashboardClick}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0072CE] hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/signup")}
                      className="text-sm"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => navigate("/login")}
                      className="text-sm"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Mobile Actions - Shown only on mobile */}
              <div className={`items-center gap-1 ${isMobile ? 'flex' : 'hidden'}`}>
                <ThemeToggle />
                {isAuthenticated ? (
                  <Button 
                    variant="default"
                    onClick={handleDashboardClick}
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <User className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button 
                    variant="default"
                    onClick={() => navigate("/login")}
                    size="sm"
                    className="h-8 px-2 text-xs"
                  >
                    <LogIn className="w-3.5 h-3.5 mr-1" />
                    Login
                  </Button>
                )}
                <MobileNavDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

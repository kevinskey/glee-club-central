
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { MobileNavDropdown } from "@/components/layout/mobile/MobileNavDropdown";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, UserPlus, Bell } from "lucide-react";
import { Icons } from "@/components/Icons";
import { useHomePageData } from "@/hooks/useHomePageData";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, user, logout, isAdmin } = useAuth();
  const { upcomingEvents } = useHomePageData();
  
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
      <div className="container mx-auto flex h-16 md:h-14 items-center justify-between px-4 bg-white/95 dark:bg-gray-800/95 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md">
        {/* Enhanced Logo Section */}
        <div className="flex-shrink-0">
          <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors group">
            <Icons.logo className="h-8 md:h-7 w-auto" />
            <div className="ml-2 md:ml-2">
              <div className="text-lg md:text-base text-[#003366] dark:text-white font-bold font-playfair">
                GleeWorld
              </div>
              <div className="text-xs text-[#003366]/70 dark:text-white/70 font-medium -mt-1 hidden sm:block">
                Spelman College
              </div>
            </div>
            {/* Event Indicator - Mobile */}
            {upcomingEvents.length > 0 && (
              <div className="ml-2 md:hidden">
                <div className="relative">
                  <Bell className="h-4 w-4 text-[#003366] dark:text-white" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </Link>
        </div>
        
        {/* Desktop Navigation - Enhanced */}
        <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
          <Link to="/" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            About
          </Link>
          <Link to="/calendar" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors relative">
            Events
            {upcomingEvents.length > 0 && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </Link>
          <a href="https://reader.gleeworld.org" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Reader
          </a>
          <a href="https://studio.gleeworld.org" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Studio
          </a>
          <a href="https://merch.gleeworld.org" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Merch
          </a>
          <Link to="/store" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Store
          </Link>
          <Link to="/contact" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Contact
          </Link>
        </nav>
        
        {/* Right Side Actions - Enhanced */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
          
          {/* Desktop Auth Buttons - Enhanced */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  onClick={handleDashboardClick}
                  className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
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
                  className="text-sm bg-white dark:bg-gray-800 border-2 border-[#003366] text-[#003366] dark:text-[#003366] hover:bg-[#003366] hover:text-white dark:hover:bg-[#003366] dark:hover:text-white font-medium"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigate("/login")}
                  className="text-sm bg-[#003366] hover:bg-[#003366]/90 text-white font-medium"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <MobileNavDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}

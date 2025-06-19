
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, UserPlus, Bell, Menu, X } from "lucide-react";
import { Icons } from "@/components/Icons";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useSSOAuth } from '@/hooks/useSSOAuth';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function UnifiedPublicHeader() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, user, logout, isAdmin } = useAuth();
  const { upcomingEvents } = useHomePageData();
  const { navigateToReader } = useSSOAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleDashboardClick = () => {
    const isKnownAdmin = user?.email === 'kevinskey@mac.com';
    const hasAdminRole = isAdmin();
    
    if (isKnownAdmin || hasAdminRole) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const handleReaderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToReader();
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md w-full">
      <div className="w-full max-w-full mx-auto flex h-14 items-center justify-between px-2 sm:px-4 bg-white/95 dark:bg-gray-800/95 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        {/* Logo Section */}
        <div className="flex-shrink-0 min-w-0">
          <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors group min-w-0">
            <Icons.logo className="h-7 w-7 flex-shrink-0" />
            <div className="ml-2 min-w-0">
              <div className="text-sm sm:text-base text-[#003366] dark:text-white font-bold font-playfair truncate">
                GleeWorld
              </div>
              <div className="text-xs text-[#003366]/70 dark:text-white/70 font-medium -mt-1 hidden sm:block truncate">
                Spelman College
              </div>
            </div>
            {/* Event Indicator - Mobile only */}
            {upcomingEvents.length > 0 && (
              <div className="ml-1 sm:hidden">
                <Bell className="h-3 w-3 text-[#003366] dark:text-white" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center">
          <Link to="/" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap">
            About
          </Link>
          <Link to="/calendar" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors relative whitespace-nowrap">
            Events
            {upcomingEvents.length > 0 && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </Link>
          <a 
            href="#" 
            onClick={handleReaderClick}
            className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap"
          >
            Reader
          </a>
          <a href="https://studio.gleeworld.org" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap">
            Studio
          </a>
          <a href="https://merch.gleeworld.org" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap">
            Merch
          </a>
          <Link to="/store" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap">
            Store
          </Link>
          <Link to="/contact" className="text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap">
            Contact
          </Link>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost"
                  onClick={handleDashboardClick}
                  className="text-xs xl:text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-2 xl:px-3"
                >
                  <User className="w-4 h-4 xl:mr-2" />
                  <span className="hidden xl:inline">Dashboard</span>
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-xs xl:text-sm font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-2 xl:px-3"
                >
                  <LogOut className="w-4 h-4 xl:mr-2" />
                  <span className="hidden xl:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/signup")}
                  className="text-xs xl:text-sm bg-white dark:bg-gray-800 border-2 border-[#003366] text-[#003366] dark:text-[#003366] hover:bg-[#003366] hover:text-white dark:hover:bg-[#003366] dark:hover:text-white font-medium px-2 xl:px-3"
                >
                  <UserPlus className="w-4 h-4 xl:mr-2" />
                  <span className="hidden xl:inline">Sign Up</span>
                </Button>
                <Button 
                  variant="default"
                  onClick={() => navigate("/login")}
                  className="text-xs xl:text-sm bg-[#003366] hover:bg-[#003366]/90 text-white font-medium px-2 xl:px-3"
                >
                  <LogIn className="w-4 h-4 xl:mr-2" />
                  <span className="hidden xl:inline">Login</span>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden flex-shrink-0">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#003366] dark:text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <Icons.logo className="h-8 w-8" />
                      <span className="font-bold text-lg text-[#003366] dark:text-white">GleeWorld</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Navigation */}
                  <nav className="flex-1 py-6 space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12"
                      onClick={() => handleNavClick("/")}
                    >
                      Home
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12"
                      onClick={() => handleNavClick("/about")}
                    >
                      About
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12"
                      onClick={() => handleNavClick("/calendar")}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>Events</span>
                        {upcomingEvents.length > 0 && (
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12"
                      onClick={handleReaderClick}
                    >
                      Reader
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12"
                      onClick={() => window.open("https://studio.gleeworld.org", "_blank")}
                    >
                      Studio
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12"
                      onClick={() => window.open("https://merch.gleeworld.org", "_blank")}
                    >
                      Merch
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12"
                      onClick={() => handleNavClick("/store")}
                    >
                      Store
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12"
                      onClick={() => handleNavClick("/contact")}
                    >
                      Contact
                    </Button>
                  </nav>
                  
                  {/* Auth Section */}
                  <div className="border-t pt-4 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full h-12"
                          onClick={handleDashboardClick}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full h-12 text-red-600 hover:text-red-700"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full h-12"
                          onClick={() => handleNavClick("/signup")}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Sign Up
                        </Button>
                        <Button 
                          variant="default" 
                          className="w-full h-12 bg-[#003366] hover:bg-[#003366]/90"
                          onClick={() => handleNavClick("/login")}
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Login
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

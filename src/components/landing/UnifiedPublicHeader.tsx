
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, UserPlus, Bell, Menu, X, Home, Info, Calendar, Music, Store, Contact, Shield } from "lucide-react";
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
  const { isAuthenticated, profile, user, logout } = useAuth();
  const { upcomingEvents } = useHomePageData();
  const { navigateToReader } = useSSOAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleDashboardClick = () => {
    const isKnownAdmin = user?.email === 'kevinskey@mac.com';
    const hasAdminRole = profile?.is_super_admin || profile?.role === 'admin';
    
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
    navigate("/reader");
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isUserAdmin = profile?.is_super_admin || profile?.role === 'admin';

  const navigationLinks = [
    { label: "Home", path: "/", icon: Home },
    // Admin Panel as second item if user is admin
    ...(isAuthenticated && isUserAdmin ? [{ label: "Admin Panel", path: "/admin", icon: Shield }] : []),
    { label: "About", path: "/about", icon: Info },
    { 
      label: "Events", 
      path: "/calendar", 
      icon: Calendar,
      hasNotification: upcomingEvents.length > 0 
    },
    { label: "Reader", path: "#", icon: Music, onClick: handleReaderClick },
    { label: "Studio", external: "https://studio.gleeworld.org", icon: Music },
    { label: "Store", path: "/store", icon: Store },
    { label: "Contact", path: "/contact", icon: Contact },
  ];
  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md w-full">
      <div className="w-full max-w-full mx-auto flex h-14 items-center justify-between px-2 sm:px-4 bg-white/95 dark:bg-gray-800/95 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        {/* Logo Section */}
        <div className="flex-shrink-0 min-w-0">
          <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors group min-w-0">
            <Icons.logo className="h-7 w-7 flex-shrink-0" />
            <div className="ml-2 min-w-0">
              <div className="text-sm sm:text-base lg:text-lg xl:text-xl text-[#003366] dark:text-white font-bold font-playfair truncate">
                GleeWorld
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-[#003366]/70 dark:text-white/70 font-medium -mt-1 hidden sm:block lg:hidden xl:block truncate">
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
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3 flex-1 justify-center mx-4">
          <Link to="/" className="text-sm lg:text-base font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap px-2 py-1">
            Home
          </Link>
          <Link to="/about" className="text-sm lg:text-base font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap px-2 py-1">
            About
          </Link>
          <Link to="/calendar" className="text-sm lg:text-base font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors relative whitespace-nowrap px-2 py-1">
            Events
            {upcomingEvents.length > 0 && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </Link>
          <a 
            href="#" 
            onClick={handleReaderClick}
            className="text-sm lg:text-base font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap px-2 py-1"
          >
            Reader
          </a>
          <a href="https://studio.gleeworld.org" className="text-sm lg:text-base font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap px-2 py-1">
            Studio
          </a>
          <Link to="/store" className="text-sm lg:text-base font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap px-2 py-1">
            Store
          </Link>
          <Link to="/contact" className="text-sm lg:text-base font-medium text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap px-2 py-1">
            Contact
          </Link>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Desktop Auth Buttons - Made smaller with visible icons */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleDashboardClick}
                  className="h-7 w-7 p-0 rounded-full text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  title="Dashboard"
                >
                  <User className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-7 w-7 p-0 rounded-full text-[#003366] dark:text-white hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className="h-7 w-7 p-0 rounded-full bg-white dark:bg-gray-800 border-2 border-[#003366] text-[#003366] dark:text-[#003366] hover:bg-[#003366] hover:text-white dark:hover:bg-[#003366] dark:hover:text-white"
                  title="Sign Up"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="h-7 w-7 p-0 rounded-full bg-[#003366] hover:bg-[#003366]/90 text-white"
                  title="Login"
                >
                  <LogIn className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex-shrink-0">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#003366] dark:text-white relative">
                  <Menu className="h-6 w-6" />
                  {upcomingEvents.length > 0 && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <Icons.logo className="h-10 w-10" />
                      <div>
                        <div className="font-bold text-lg text-[#003366] dark:text-white font-playfair">GleeWorld</div>
                        <div className="text-sm text-[#003366]/70 dark:text-white/70 font-medium">Spelman College</div>
                      </div>
                    </div>
                  </div>

                  {/* User Profile Section (if authenticated) */}
                  {isAuthenticated && (
                    <div className="px-6 py-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#003366] flex items-center justify-center text-white font-medium">
                          {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-[#003366] dark:text-white">
                            {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email}
                          </div>
                          <div className="text-sm text-[#003366]/70 dark:text-white/70">
                            {isUserAdmin ? 'Administrator' : 'Member'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation */}
                  <div className="flex-1 py-4">
                    <nav className="space-y-1 px-3">
                      {navigationLinks.map((link) => (
                        <Button
                          key={link.label}
                          variant="ghost"
                          className="w-full justify-start h-12 px-4 rounded-xl text-left font-medium text-[#003366] dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
                          onClick={() => {
                            if (link.onClick) {
                              link.onClick(new Event('click') as any);
                            } else if (link.external) {
                              window.open(link.external, "_blank");
                              setIsMobileMenuOpen(false);
                            } else if (link.path) {
                              handleNavClick(link.path);
                            }
                          }}
                        >
                          <link.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="flex-1">{link.label}</span>
                          {link.hasNotification && (
                            <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                          )}
                        </Button>
                      ))}
                    </nav>
                  </div>
                  
                  {/* Auth Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full h-12 border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200 justify-start"
                          onClick={handleDashboardClick}
                        >
                          <User className="w-4 h-4 mr-2" />
                          My Dashboard
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 justify-start"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full h-12 border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200 justify-start"
                          onClick={() => handleNavClick("/signup")}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Account
                        </Button>
                        <Button 
                          variant="default" 
                          className="w-full h-12 bg-[#003366] hover:bg-[#003366]/90 text-white transition-all duration-200 justify-start"
                          onClick={() => handleNavClick("/login")}
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      </div>
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

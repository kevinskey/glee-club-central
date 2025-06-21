
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, UserPlus, Menu, Home, Info, Calendar, Music, Store, Contact, Shield } from "lucide-react";
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
  const { isAuthenticated, profile, user, signOut } = useAuth();
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
      await signOut();
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

  const handleSignUpClick = () => {
    navigate("/signup");
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
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
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 lg:px-8 bg-white/95 dark:bg-gray-800/95 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors group">
            <Icons.logo className="h-8 w-8 flex-shrink-0" />
            <div className="ml-3">
              <div className="text-lg text-gray-800 dark:text-white font-bold font-playfair">
                GleeWorld
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200 font-medium -mt-1 hidden sm:block">
                Spelman College
              </div>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center mx-8">
          <Link to="/" className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            About
          </Link>
          <Link to="/calendar" className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors relative">
            Events
            {upcomingEvents.length > 0 && (
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </Link>
          <a 
            href="#" 
            onClick={handleReaderClick}
            className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            Reader
          </a>
          <a href="https://studio.gleeworld.org" className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Studio
          </a>
          <Link to="/store" className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Store
          </Link>
          <Link to="/contact" className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            Contact
          </Link>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleDashboardClick}
                  className="text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleSignUpClick}
                  className="text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400"
                >
                  Sign Up
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLoginClick}
                  className="text-gray-800 dark:text-white hover:text-orange-500 dark:hover:text-orange-400"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu - Only on mobile screens */}
          <div className="lg:hidden flex-shrink-0">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-800 dark:text-white relative">
                  <Menu className="h-6 w-6" />
                  {upcomingEvents.length > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
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
                        <div className="font-bold text-lg text-gray-800 dark:text-white font-playfair">GleeWorld</div>
                        <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">Spelman College</div>
                      </div>
                    </div>
                  </div>

                  {/* User Profile Section (if authenticated) */}
                  {isAuthenticated && (
                    <div className="px-6 py-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                          {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 dark:text-white">
                            {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
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
                          className="w-full justify-start h-12 px-4 rounded-xl text-left font-medium text-gray-800 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 relative"
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
                            <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse ml-2"></div>
                          )}
                        </Button>
                      ))}
                    </nav>

                    {/* Auth Section for Mobile */}
                    <div className="px-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {isAuthenticated ? (
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-12 px-4 rounded-xl text-left font-medium text-gray-800 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
                            onClick={handleDashboardClick}
                          >
                            <User className="w-5 h-5 mr-3 flex-shrink-0" />
                            Dashboard
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-12 px-4 rounded-xl text-left font-medium text-gray-800 dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-12 px-4 rounded-xl text-left font-medium text-gray-800 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
                            onClick={handleSignUpClick}
                          >
                            <UserPlus className="w-5 h-5 mr-3 flex-shrink-0" />
                            Sign Up
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-12 px-4 rounded-xl text-left font-medium text-gray-800 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
                            onClick={handleLoginClick}
                          >
                            <LogIn className="w-5 h-5 mr-3 flex-shrink-0" />
                            Sign In
                          </Button>
                        </div>
                      )}
                    </div>
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
